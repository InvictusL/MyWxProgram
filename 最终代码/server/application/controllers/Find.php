<?php
use QCloud_WeApp_SDK\Mysql\Mysql as DB;
defined('BASEPATH') OR exit('No direct script access allowed');
//朋友圈界面
class Find extends CI_Controller{
  public function index(){}

  //获取用户动态
  public function getUserComment()
  {
    $rows = DB::select('User_Comment',['*'],'','and','order by comment_time DESC');
    $x=0;
    $commentuser = [];
    $commentbook = [];
    foreach($rows as $comment){
      $commentuser[$x] = DB::select('User',['user_name','avatar_url'],"user_id=$comment->user_id");
      $commentbook[$x++] = DB::select('Book',['book_name','author','picture_url'],"book_id=$comment->book_id");
    }
    $this->json([
      'commentuser'=>$commentuser,
      'comment'=>$rows,
      'commentbook'=>$commentbook
    ]);
  }

  //添加动态
  public function addComment($userid, $bookid, $comment){
    $usercomment = urldecode($comment);
    $time = date('y-m-d H:i:s');
    DB::insert('User_Comment',[
      'user_id' => $userid,
      'book_id' => $bookid,
      'comment' => $usercomment,
      'comment_time' => $time
    ]);
  }
}
?>