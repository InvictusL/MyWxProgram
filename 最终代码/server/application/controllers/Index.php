<?php
defined('BASEPATH') OR exit('No direct script access allowed');
//主界面
use QCloud_WeApp_SDK\Mysql\Mysql as DB;

class Index extends CI_Controller{

  //获取用户的收藏信息
  public function getMyCollection($userid){
    $bookid = DB::select('User_Collect', ['book_id'], "user_id = $userid");//该用户所有收藏书的id
    $x=0;
    $bookitem = [];
    foreach($bookid as $bookiditem){
      $bookitem[$x++] = DB::select('Book', ['book_name', 'picture_url','book_id'], "book_id = $bookiditem->book_id");//每本书的名称和封面地
    }
     $this->json([
      'bookitem'=> $bookitem
       ]);
  }

  //获取用户的id
  public function getUserid($username){
    $user = "\"".urldecode($username)."\"";
    $userid = DB::select('User', ['user_id'], "user_name = $user");
    $this->json($userid);
  }

  //用户注册
  public function register($username){
    $user = urldecode($username);
    $useravatar = $_GET["avatar"];
    DB::insert('User',[
      'user_name'=> $user,
      'reading_time'=> 0,
      'avatar_url'=>$useravatar
    ]);
    $user = "\"".$user."\"";
    $userid = DB::select('User', ['user_id'], "user_name = $user");
    $this->json($userid);
  }

  //获取用户的读书笔记
  public function getMyNote($userid){
    $note = DB::select('User_ReadingNote', ['book_id', 'reading_note', 'page'], "user_id = $userid");//''中不能传入参数
    $x = 0;
    $bookpic = [];
    foreach($note as $postitem){
      $bookpic[$x++] = DB::select('Book', ['picture_url','book_name'], "book_id = $postitem->book_id");
    }
    $this->json([
      'note' => $note,
      'bookpic' => $bookpic
    ]);
  }

  //删除读书笔记
  public function deleteNote($reading_note){
    $readingnote = urldecode($reading_note);
    echo $readingnote;
    DB::delete('User_ReadingNote', ['reading_note' => $readingnote]);
  }

  //获取用户制作的海报
  public function getMyPost($userid){
    $post = DB::select('Post', ['picture_url', 'post_id'], "user_id = $userid");//该用户所有收藏书的id
     $this->json([
      'post'=> $post
       ]);
  }

  //删除海报
  public function deletePost($postid){
    DB::delete('Post', ['post_id'=>$postid]);
  }

  //获取最近读书的列表
  public function getCurrentBook($userid){
    $currentbook = DB::select('User_Book', ['*'], "user_id = $userid", 'and', 'order by last_readingtime DESC');
    $x=0;
    $currentbookitem = [];
    foreach($currentbook as $bookitem){
      $currentbookitem[$x++] = DB::select('Book', ['book_name', 'picture_url','book_id'], "book_id = $bookitem->book_id");
  }
        $this->json([
          'currentbook'=>$currentbook,
          'currentbookitem'=>$currentbookitem
        ]);
}

//获取书籍信息
public function getBookshelf($userid){
    $currentbook = DB::select('User_Book', ['*'], "user_id = $userid");
    $x=0;
    $currentbookitem = [];
    foreach($currentbook as $bookitem){
      $currentbookitem[$x++] = DB::select('Book', ['book_name', 'picture_url','book_id'], "book_id = $bookitem->book_id");
  }
        $this->json([
          'currentbook'=>$currentbook,
          'currentbookitem'=>$currentbookitem
        ]);
}

//获取书籍信息
public function getBookInfo($bookid){
  $bookitem = DB::select('Book', ['book_name', 'picture_url', 'author', 'MainBodyChapter1_1'], "book_id = $bookid");
  $this->json($bookitem);
}

//获取某本书的读书进程
public function getReadingProgress($bookid,$userid){
  $readingprogress = DB::select('User_Book', ['reading_progress'], "book_id = $bookid and user_id = $userid");
  $this->json($readingprogress);
}

//更新读书进程
public function changeReadingProgress($bookid,$userid,$page){
  DB::update('User_Book', ['reading_progress'=>$page], "book_id = $bookid and user_id = $userid");
  $this->json();
}

//制作添加海报
public function addPost(){
  $path = $_GET['path'];
  $userid = $_GET['userid'];
  $bookid = $_GET['bookid'];
  DB::insert('Post', ['picture_url'=>$path, 'user_id'=>$userid, 'book_id'=>$bookid]);
}

//制作添加读书笔记
public function addWriting($userid, $bookid, $words, $page){
  $word = urldecode($words);
  DB::insert('User_ReadingNote', ['user_id'=>$userid, 'book_id'=> $bookid, 'reading_note'=>$word, 'page'=>$page]);
}

//修改读书笔记
public function updateWriting($userid, $bookid, $words, $page){
  $word = urldecode($words);
  DB::update('User_ReadingNote', ['reading_note'=>$word],['user_id'=>$userid, 'book_id'=> $bookid,  'page'=>$page]);
}
}