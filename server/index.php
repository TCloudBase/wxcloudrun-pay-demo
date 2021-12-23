<?php
  $mchid = '';  // 将子商户ID填写到这里
  $head = getallheaders();
  if(empty($head['x-wx-source'])){
    echo sprintf('非法途径');
    return 100;
  }
  $body = json_decode(file_get_contents('php://input'),true);
  if($body==null || empty($body["payid"])) {
    echo sprintf('没有收到订单ID');
  } else {
    $payid = $body["payid"];
    $url = null;
    $param = array();
    $method = !empty($body["method"]) ? $body["method"] : null;
    if($method == 'unifiedorder'){
      $url = 'http://api.weixin.qq.com/_/pay/unifiedOrder';
      $param = array(
        'body' => !empty($body["paytext"]) ? $body["paytext"] : "测试微信支付",
        'openid' => !empty($head['x-wx-openid']) ? $head['x-wx-openid'] : null,
        'out_trade_no' =>  '2021WERUN'.$payid,
        'spbill_create_ip' =>  !empty($head['x-forwarded-for']) ? $head['x-forwarded-for'] : null,
        'env_id' => !empty($head['x-wx-env']) ? $head['x-wx-env'] : null,
        'sub_mch_id' =>  $mchid,
        'total_fee' =>  !empty($body["fee"]) ? $body["fee"] : 2,
        'callback_type' => 2,
        'container' => array(
          'path' => '/'
        )
      );
    } else if($method == 'queryorder'){
      $url = 'http://api.weixin.qq.com/_/pay/queryorder';
      $param = array(
        'out_trade_no' =>  '2021WERUN'.$payid,
        'sub_mch_id' =>  $mchid
      );
    } else if($method == 'closeorder'){
      $url = 'http://api.weixin.qq.com/_/pay/closeorder';
      $param = array(
        'out_trade_no' =>  '2021WERUN'.$payid,
        'sub_mch_id' =>  $mchid
      );
    } else if($method == 'refund'){
      $url = 'http://api.weixin.qq.com/_/pay/refund';
      $param = array(
        'body' => !empty($body["paytext"]) ? $body["paytext"] : "测试微信支付",
        'out_trade_no' =>  '2021WERUN'.$payid,
        'out_refund_no' => 'R2021WERUN'.$payid,
        'env_id' => !empty($head['x-wx-env']) ? $head['x-wx-env'] : null,
        'sub_mch_id' =>  $mchid,
        'total_fee' =>  !empty($body["fee"]) ? $body["fee"] : 2,
        'refund_fee' => !empty($body["refundfee"]) ? $body["refundfee"] : 2,
        'refund_desc' => !empty($body["refundtext"]) ? $body["refundtext"] : "测试退款",
        'callback_type' => 2,
        'container' => array(
          'path' => '/'
        )
      );
    } else if($method == 'queryrefund'){
      $url = 'http://api.weixin.qq.com/_/pay/queryrefund';
      $param = array(
        'out_trade_no' =>  '2021WERUN'.$payid,
        'sub_mch_id' =>  $mchid
      );
    } else {
      $url = null;
    }
    if($url!=null){
      $curl = curl_init();
      curl_setopt_array($curl, array(
        CURLOPT_URL => $url,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_ENCODING => '',
        CURLOPT_MAXREDIRS => 10,
        CURLOPT_TIMEOUT => 0,
        CURLOPT_FOLLOWLOCATION => true,
        CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
        CURLOPT_CUSTOMREQUEST => 'POST',
        CURLOPT_POSTFIELDS => json_encode($param),
        CURLOPT_HTTPHEADER => array(
          'Content-Type: application/json'
        ),
      ));
      $response = curl_exec($curl);
      curl_close($curl);
      echo $response;
    } else {
      echo sprintf('没有相关方法');
    }
  }
?>