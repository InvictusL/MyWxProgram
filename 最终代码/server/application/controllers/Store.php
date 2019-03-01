<?php
use QCloud_WeApp_SDK\Mysql\Mysql as DB;
defined('BASEPATH') OR exit('No direct script access allowed');
//商城界面
class Store extends CI_Controller{
  // 从数据库中获取所有书的封面picture_url和书名book_name和book_id
  public function index(){}
  public function getBookInfo()
  {
    $rows = DB::select('Book',['picture_url','book_name','book_id']);
    $this->json($rows);
  }

  //通过分类获取书籍信息
  public function getBookInfoWithCategory($category)
  {
    $temp = "\"".urldecode($category)."\"";
    $rows = DB::select('Book',['picture_url','book_name','book_id'],"category = $temp");
    $this->json($rows);
  }

  
  //按照热度（收藏数+阅读数）排序获取书籍信息
   public function getTopBookInfo()
   {
     $rows = DB::select('Book',['picture_url','book_name','book_id','reading_num','collect_num'],'','and','order by reading_num + collect_num DESC');
     $this->json($rows);
   }
}
?>