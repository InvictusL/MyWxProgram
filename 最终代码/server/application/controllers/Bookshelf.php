<?php
use QCloud_WeApp_SDK\Mysql\Mysql as DB;
defined('BASEPATH') OR exit('No direct script access allowed');
//书架界面
class Bookshelf extends CI_Controller{
  public function index(){}

  //删除某用户的某本书籍
  public function deleteBook($bookid,$userid)
  {
    DB::delete('User_Book',['user_id' => $userid,'book_id'=>$bookid],"and");
   
  }

  //删除某用户的收藏书籍
  public function deleteCollect($bookid,$userid)
  {
    DB::delete('User_Collect',['user_id' => $userid,'book_id'=>$bookid],"and");
   
  }

  //查询某用户的自定义分类
  public function getMyCategory($userid){
    $rows = DB::select('Book_Category', ['category_name'], "user_id = $userid", 'and', 'group by category_name');
    $this->json($rows);
  }

  //从 我的分类 中查询书籍
  public function getBookfromCategory($category, $userid){
    $bookcate = "\"".urldecode($category)."\"";
    $bookcate = 
    $rows = DB::select('Book_Category',['book_id'], "category_name = $bookcate and user_id = $userid");//多条件查询可直接写成一个字符串
    $x=0;
    $book = [];
    foreach($rows as $row){
      $book[$x++] = DB::select('Book', ['book_name', 'picture_url','book_id'], "book_id = $row->book_id");
    }
    $this->json([
      'book'=>$book,
    ]);
  }

  //将相应书籍加入到相应分类中
  public function addtoCategory($userid, $bookid, $category){
    $categoryname = urldecode($category);
    DB::insert('Book_Category', ['user_id'=>$userid, 'book_id'=>$bookid, 'category_name'=>$categoryname] );
  }

  //从某分类中删除某本书籍
  public function deleteBookfromCategory($bookid, $userid, $catename){
    $cate = urldecode($catename);
    DB::delete('Book_Category', ['user_id'=>$userid, 'book_id'=>$bookid, 'category_name'=>$cate]);
  }

  //删除某个分类
  public function delCategory($cate){
    $catename = urldecode($cate);
    DB::delete('Book_Category', ['category_name'=>$catename]);
  }
}
?>