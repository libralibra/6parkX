// ==UserScript==
// @name         6parkX
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  make 6park better after uBlock filtering
// @author       Daniel
// @match        http://*.toutiaoabc.com/*
// @match        http://*.6park.com/*
// @match        http://*.6parker.com/*
// @match        http://*.6parkbbs.com/*
// @match        http://*.cool18.com/*
// @match        https://*.toutiaoabc.com/*
// @match        https://*.6park.com/*
// @match        https://*.6parker.com/*
// @match        https://*.6parknews.com/*
// @match        https://*.6parkbbs.com/*
// @match        https://*.cool18.com/*
// @require      https://code.jquery.com/jquery-latest.min.js
// @grant        none
// ==/UserScript==

'use strict';

// 全站主页
// MAINSITE:    https://www.6park.com/gb.shtml
// 新闻速递页面
// NEWSLIST:    https://www.6parknews.com/newspark/index.php
//              https://www.6parknews.com/newspark/
// 单个新闻页面
// NEWSPAGE:    https://www.6parknews.com/newspark/view.php?app=news&act=view&nid=386022
//              https://www.6parknews.com/newspark/index.php?act=view&nid=386022
// 新闻回复
// NEWREPLY:    https://www.6parknews.com/newspark/index.php?act=newsreply&nid=386022
//              https://www.6parknews.com/newspark/index.php?act=newsreply&rid=7537173&nid=386829#step17
// 板块主页
// SUBFORUM:    https://club.6parkbbs.com/other/index.php
//              https://club.6parkbbs.com/chan6/index.php
// 单个帖子页面
// POSTPAGE:    https://club.6parkbbs.com/nz/index.php?app=forum&act=threadview&tid=114309
//              https://web.6parkbbs.com/index.php?act=view&bbsid=2024&tid=146522
// 成人入口
// SEXENTRY:    https://www.cool18.com/parks.php
// 成人板块
// SEXYMAIN:    https://www.cool18.com/bbs3/index.php
//              https://www.cool18.com/bbs6/index.php
// 成人帖子
// SEXYPOST:    https://www.cool18.com/bj/index.php?app=forum&act=threadview&tid=14532099
// 热评新闻
// HOTREPLY:    https://www.6parknews.com/newspark/index.php?act=hotreply
// 热门新闻
// HOTVIEWS:    https://www.6parknews.com/newspark/index.php?act=hotview
// 即刻热度
// HOTPOSTS:    https://www.6parknews.com/newspark/index.php?act=longview
// 世界各地
// ALLWORLD:    https://local.6parknews.com/index.php?type_id=5
// 各地新闻汇总
// AREANEWS:    https://local.6parknews.com/index.php?act=hotview
// 回复成功
// AFTERREP:    回复帖子成功页面,没有表格或者div,需要判断标题,注意string的search函数貌似无用,match完美
// 72小时热评
// 72HOTREP:    https://www.6parknews.com/newspark/index.php?app=news&act=replyhotvote&page=1
// 新开板块
// NEWFORUM:    https://web.6parkbbs.com/index.php?act=bbs&bbsid=2015
// 新板块帖子
// NEWPOSTS:    https://web.6parkbbs.com/index.php?app=forum&act=view&tid=139519
// 头条精选
// GOLDPOST:    https://www.6parknews.com/newspark/index.php?act=gold
// 个人主页
// MAINHOME:    https://home.6park.com/index.php?app=home&act=action
//              https://home.6park.com/index.php
const MODETYPE = {
    IAM6PARK: '留园页面',
    MAINSITE: '全站主页',
    NEWSLIST: '新闻速递',
    NEWSPAGE: '新闻页面',
    NEWREPLY: '新闻回复',
    SUBFORUM: '板块主页',
    POSTPAGE: '帖子页面',
    SEXENTRY: '成人入口',
    SEXYMAIN: '成人板块',
    SEXYPOST: '成人帖子',
    HOTREPLY: '热评新闻',
    HOTVIEWS: '热门新闻',
    HOTPOSTS: '即刻热度',
    ALLWORLD: '世界各地',
    AREANEWS: '各地新闻汇总',
    AFTERREP: '回复成功',
    HOTREP72: '72小时热评',
    NEWFORUM: '新开板块',
    NEWPOSTS: '新板块帖子',
    GOLDPOST: '头条精选',
    MAINHOME: '个人主页'
};

// get mode
let getMode = () => {
    // get the url of the current page
    let url = window.location.href;

    // set the mode
    let mode = MODETYPE.IAM6PARK;
    if ($(document).attr('title').match("已加入")) {
        mode = MODETYPE.AFTERREP;
    } else if (url.includes('www.6park.com') && url.endsWith('.shtml')) {
        mode = MODETYPE.MAINSITE;
    } else if (url.includes('act=newsreply&')) {
        mode = MODETYPE.NEWREPLY;
    } else if ((url.includes('newspark/index.php') || url.endsWith('/newspark/')) && url.includes('act=newsreply')) {
        mode = MODETYPE.NEWSLIST;
    } else if (url.includes('act=view&nid=')) {
        mode = MODETYPE.NEWSPAGE;
    } else if (url.includes('club.6parkbbs.com') && url.endsWith('index.php')) {
        mode = MODETYPE.SUBFORUM;
    } else if (url.includes('6parkbbs.com') &&
        (url.includes('index.php?app=forum&act=threadview&tid=') ||
            (url.includes('act=view&bbsid=') && url.includes('&tid=')))) {
        mode = MODETYPE.POSTPAGE;
    } else if (url.endsWith('cool18.com/parks.php')) {
        mode = MODETYPE.SEXENTRY;
    } else if (url.includes('cool18.com') && url.endsWith('index.php')) {
        mode = MODETYPE.SEXYMAIN;
    } else if (url.includes('cool18.com') && url.includes('index.php?app=forum&act=threadview&tid=')) {
        mode = MODETYPE.SEXYPOST;
    } else if (url.endsWith('act=hotreply')) {
        mode = MODETYPE.HOTREPLY;
    } else if (url.endsWith('act=hotview')) {
        mode = url.includes('local') ? MODETYPE.AREANEWS : MODETYPE.HOTVIEWS;
    } else if (url.endsWith('act=longview')) {
        mode = MODETYPE.HOTPOSTS;
    } else if (url.includes('local.6parknews.com') && url.includes('?type_id=')) {
        mode = MODETYPE.ALLWORLD;
    } else if (url.includes('app=news&act=replyhotvote')) {
        mode = MODETYPE.HOTREP72;
    } else if (url.includes('act=bbs&bbsid=')) {
        mode = MODETYPE.NEWFORUM;
    } else if (url.includes('app=forum&act=view&tid=')) {
        mode = MODETYPE.NEWPOSTS;
    } else if (url.endsWith('act=gold')) {
        mode = MODETYPE.GOLDPOST;
    //} else if (url.includes('app=home&act=action')) {
    } else if (url.includes('home.6park.com')) {
        mode = MODETYPE.MAINHOME;
    }

    return mode;
};

// 字体比例
let font_ratio = 1.15;

// 行高比例
let line_ratio = 1.5;

// 添加google字体
let addGoogleFont = (FontName) => {
    FontName = FontName.replace(' ', '+');
    let fontURL = '<link href="https://fonts.googleapis.com/css?family=' + FontName + '" rel="stylesheet">';
    $('head').append($(fontURL));
};

// 修改字体
let changeFont = (FontName) => {
    $('*').css('font-family', FontName);
};

// 修改字体大小
let changeFontSize = (s = 1) => {
    $('*').css('font-size', s + 'rem');
    //$('*').css('font-size', s*100 + '%');
};

// 修改行高
let changeLineHeight = (s = 1) => {
    $('*').css('line-height', s * 100 + '%');
};

// 网站主页,成人主入口，回复帖子后
let changeMainPage = () => {
    $('table').attr('width', '90%');
    // 主页板块信息
    $('td.td8 > table').attr('width', '100%');
    // 新板块浮动信息加宽（如果有的话）
    $('div.plate-list').css('width', '90%');
    $('p#sitemap_dir').css('width', '100%').css('max-width', $(window).width() - 5 + 'px');
    $('a.plate-box').css('margin-left', '20px');
};

// 新闻页面
let changeNewsPage = () => {
    // 删除右边广告(右边广告经正文加宽会看不到,但是不显示更好)
    $('div.ad').css('display', 'none');
    $('div#float').css('display', 'none');
    // 新闻正文,用百分比加宽
    $('div#mainContent').css('width', '90%');
    $('div#newscontent').css('width', '100%');
    $('div#newscontent_2').css('width', '100%');
    // 新闻正文字体增大
    $('div#shownewsc').css('font-size', '120%');
    // 加宽上面的登录和评论表格，否则不好看
    $('table').attr('width', '90%');
    // 最下面的热评宽度
    $('div#reply_list_all').css('width', '100%');
};

// 新闻回复
let changeNewsReply = () => {
    // 所有内容加宽(有好几个table,全部加宽)
    $('table').css('width', '90%');
    $('div#reply_list_all').css('width', '90%');
    // 回复交替背景
    $('div#reply_list_all > div:odd').css("background-color", "#ccdde2");
    // 回复框宽度百分比,高度宽度绝对值
    $("textarea#r_content").css('width', '95%').css('height', '300px');
    // 回顶div浮动到右边,监测页面滚动
    $('div.backToTop').css('left', $(window).width() - 30 + 'px');
    $(window).scroll(() => {
        $('div.backToTop').css('left', $(window).width() - 30 + 'px');
    });
};

// 板块主页,新闻速递
let changeSubForum = () => {
    // 所有内容容器加宽
    $('div.body_center').css('width', '90%');
    // 新板块浮动信息加宽
    $('div.plate-list').css('width', '100%');
    $('p#sitemap_dir').css('width', '100%').css('max-width', $(window).width() - 5 + 'px');
    $('a.plate-box').css('margin-left', '20px');
    // 页面主要内容加宽
    $('div#main').css('width', '90%');
    $('div#main_right').css('width', '100%');
    // 板块信息
    $('div#site_info').css('width', '90%').css('height', '90px');
    $('div#site_info > table').css('width', '100%');
    $('div#site_info > table > tbody > tr > td:nth-child(2)').css('width', '40%');
    // 精华区
    $('div#d_gold_list').css('width', '100%').css('height', '220px');
    $('div#d_gold_list > table').css('width', '100%');
    $('div#d_gold_title > table > tbody > tr > td:nth-child(1)').css('width', '50%');
    $('div#d_gold_title > table > tbody > tr > td:nth-child(3)').css('width', '10%');
    // 新闻速递精华列表高度调整
    $('div#d_gold_list li').css('width', '45%').css('height', '30px');
    // 帖子交替背景
    $('div#d_list > ul > li:odd').css("background-color", "#ccdde2");
    $('div#d_list > ul > li:odd ul').css("background-color", "#ccdde2");
    // 新开板块帖子交替
    $('div.repl-body > div.repl-list.repl-list-one:odd').css("background-color", "#ccdde2");
    // 包括该贴下所有回帖
    $('div.repl-list.repl-list-sen').each(function () {
        let sibColour = $(this).prevAll('div.repl-list.repl-list-one:first').css("background-color");
        $(this).css("background-color", sibColour);
    });
    $('div.repl-list.repl-list-more').each(function () {
        let sibColour = $(this).prevAll('div.repl-list.repl-list-sen:first').css("background-color");
        $(this).css("background-color", sibColour);
    });
};

// 板块帖子
let changePostPage = () => {
    // 所有内容容器加宽
    $('table').css('width', '90%');
    // 帖子内容需要单独增大,但是属于pre,用em指定可以增大字体
    $('td.show_content pre').css('width', '100%').css('font-size', '150%');
    // 回复form的父div占一半
    $('div:last-of-type:has(form)').css('width', '45%');
    // 回复表单和前期热帖两个div要重新分配宽度(1是热帖),.css('background-color','red')
    $("table:last-of-type:has(form) div:eq(1)").css('width', '45%');
    $("table:last-of-type:has(form) div:eq(2)").css('width', '45%');
    // 回复文本框宽度调整
    $('input#subject').css('width', '100%');
    $("textarea#content").css('width', '100%').css('height', '300px');
    // 回复交替背景
    $('table:last-of-type:has(form) > tbody > tr > td > ul > li:odd').css("background-color", "#ccdde2");
    //$('table:last-of-type:has(form) ul > li:even').css("background-color", "#cdf");
    // 数码等板块需要额外处理
    // 增大div
    $('div.cen-main').css('width', '90%');
    // 回复列表背景交替
    $('div.repl-body > div.repl-list.repl-list-one:odd').css("background-color", "#ccdde2");
    // 包括该贴下所有回帖
    $('div.repl-list.repl-list-sen').each(function () {
        let sibColour = $(this).prevAll('div.repl-list.repl-list-one:first').css("background-color");
        $(this).css("background-color", sibColour);
    });
    $('div.repl-list.repl-list-more').each(function () {
        let sibColour = $(this).prevAll('div.repl-list.repl-list-sen:first').css("background-color");
        $(this).css("background-color", sibColour);
    });
    $('.content-txt').css('width', '70%');
    $('#myform').css('width', '70%');
};

// 个人主页
let changeHome = () => {
    // 所有内容容器加宽
    $('div.div_center').css('width', '90%');
    $('div#headtop').css('width', '90%');
    $('div.div_center table').css('width', '100%');
    // 内容列表
    $('div.div_center > div#left_content').css('width', '85%');
    $('div.content_title').css('width', '100%').css('margin', '1px').css('padding-left', '1px');
    $('div.content_list').css('width', '100%').css('margin', '1px').css('padding-left', '1px');

    // 时间列加宽
    $('td.ac_time').css('width', '15%');
    // 表格背景
    $('div.content_list > table').css('width', '100%').css("background-color", "white");
    // 交替背景
    $('div.content_list > table > tbody > tr:odd').css("background-color", "#ccdde2");
};

// 先加载字体
addGoogleFont('Noto Sans SC');

// 页面装载完成后运行
$(document).ready(function () {
    let mode = getMode();
    console.log(mode);

    let ww = $(window).width();
    if (ww < 1300) {
        font_ratio = 1.05;
    }

    // 强制增大字体，如果需要，在单个函数中修改
    changeFont('Noto Sans SC');
    changeFontSize(font_ratio);
    changeLineHeight(line_ratio);

    // modify the style
    switch (mode) {
        case MODETYPE.IAM6PARK:
        case MODETYPE.MAINSITE:
        case MODETYPE.SEXENTRY:
        case MODETYPE.AFTERREP:
            changeMainPage();
            break;
        case MODETYPE.NEWSPAGE:
            changeNewsPage();
            break;
        case MODETYPE.NEWREPLY:
            changeNewsReply();
            break;
        case MODETYPE.SUBFORUM:
        case MODETYPE.NEWSLIST:
        case MODETYPE.NEWFORUM:
        case MODETYPE.SEXYMAIN:
        case MODETYPE.HOTREPLY:
        case MODETYPE.HOTVIEWS:
        case MODETYPE.AREANEWS:
        case MODETYPE.HOTPOSTS:
        case MODETYPE.GOLDPOST:
        case MODETYPE.ALLWORLD:
        case MODETYPE.HOTREP72:
            changeSubForum();
            break;
        case MODETYPE.POSTPAGE:
        case MODETYPE.NEWPOSTS:
        case MODETYPE.SEXYPOST:
            changePostPage();
            break;
        case MODETYPE.MAINHOME:
            changeHome();
            break;
            // alert('6park website has been modified, the mode was not captured\n' + url);
    }
});