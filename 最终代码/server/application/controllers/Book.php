<?php
use QCloud_WeApp_SDK\Mysql\Mysql as DB;
defined('BASEPATH') OR exit('No direct script access allowed');
//书籍界面
class Book extends CI_Controller{
  public function index(){}

  //根据bookid查询书籍信息
  public function getBookInfo($bookid)
  {
    $rows = DB::select('Book',['*'],"book_id = $bookid");
    $this->json($rows);
  }

  //根据bookid查询用户信息和用户的评论
  public function getBookComment($bookid)
  {
    $rows = DB::select('User_Comment',['*'],"book_id = $bookid");
    $x=0;
    $commentuser = [];
    foreach($rows as $comment){
      $commentuser[$x++] = DB::select('User',['user_name','avatar_url'],"user_id=$comment->user_id");
    }
    $this->json([
      'commentuser'=>$commentuser,
      'comment'=>$rows
    ]);
  }

  //将当前书籍添加收藏
  public function addCollect($userid,$bookid)
  {
     $rows = DB::select('User_Collect',['*'],['user_id' => $userid,'book_id'=>$bookid],"and");
    $collectSuccess = 0;
    if(!$rows)
    {
      DB::insert('User_Collect',['user_id' => $userid,'book_id'=>$bookid]);
      $collectSuccess = 1;
    }
    $this->json($collectSuccess);
  }

  //将当前书籍添加到书架
  public function addBookshelf($userid,$bookid)
  {
     $rows = DB::select('User_Book',['*'],['user_id' => $userid,'book_id'=>$bookid],"and");
    $addSuccess = 0;
    if(!$rows)
    {
      DB::insert('User_Book',['user_id' => $userid,'book_id'=>$bookid,'reading_progress'=>1,'last_readingtime'=>date("Y-m-d H:i:s")]);
      $addSuccess = 1;
    }
    $this->json($addSuccess);
  }

  //更新书籍的最后阅读时间
  public function updateLastReadingTime($bookid, $userid){
    $rows = DB::update('User_Book', ['last_readingtime'=>date("Y-m-d H:i:s")], ['user_id'=>$userid, 'book_id'=>$bookid]);
  }
}
?>