<?php

namespace app\common\model;

use app\admin\library\Auth;
use think\Model;
use traits\model\SoftDelete;

class Article extends Model
{

    use SoftDelete;

    

    // 表名
    protected $table = 'article';
    
    // 自动写入时间戳字段
    protected $autoWriteTimestamp = 'int';

    // 定义时间戳字段名
    protected $createTime = 'createtime';
    protected $updateTime = 'updatetime';
    protected $deleteTime = 'deletetime';

    // 追加属性
    protected $append = [

    ];


    protected static function init()
    {
        //模型插入前
        self::event('before_insert', function ($model) {
            $auth = Auth::instance();
            $model->created_by = $auth?$auth->id:0;
        });
        //模型更新前
        self::event('before_update', function ($model) {
            $auth = Auth::instance();
            $model->created_by = $auth?$auth->id:0;
        });


        self::afterInsert(function ($row) {
            $pk = $row->getPk();
            $row->getQuery()->where($pk, $row[$pk])->update(['weigh' => $row[$pk]]);
        });
    }




    public function articlecontent()
    {
        return $this->hasOne('app\common\model\ArticleContent', 'article_id', 'id', [], 'LEFT')->setEagerlyType(0);
    }

    public function category()
    {
        return $this->belongsTo('Category', 'category_id', 'id', [], 'LEFT')->setEagerlyType(0);
    }




}
