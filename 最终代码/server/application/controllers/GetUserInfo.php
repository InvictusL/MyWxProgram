<?php
defined('BASEPATH') OR exit('No direct script access allowed');
use QCloud_WeApp_SDK\Mysql\Mysql as DB;


class GetUserInfo extends CI_Controller{
  public function index(){
    $result = DB::row('User',['user_name'], 'user_id = 3');//列必须是数组，必须加[]
    $this->json([
      'code' => 0,
      'data' => $result
    ]);
  }

  public function func(){
    $result = DB::row('User',['user_name'], 'user_id = 3');//列必须是数组，必须加[]
    $this->json([
      'code' => 0,
      'data' => $result
    ]);
  }
  
}
