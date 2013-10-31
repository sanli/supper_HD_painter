(supper_HD_painter)
=================
超高清艺术图片手机客户端和服务器端

目标
-----------------------------------
做这个APP的目的是建立一个"超高清"中国书画艺术图片的"网上博物馆"，给用户提供深入欣赏中国古典艺术的机会。这个APP最大的特点就是提供“超高清”的图片。因为欣赏艺术品，只有能细致到每一个笔画，每一个纹理的时候，才能真真体会优美之处。这也就是为什么网上有那么多图片，但是很多人说只有到博物馆，真真看到实物的时候才能体会顶尖艺术品的优美。所以我搞到这一批与原件等大的图片时，欣喜难以表达，于我有近似欣赏需求的用户应该都会喜欢。

首先满足这些用户的需求，积累了一定用户后，可以考虑取得一些收入,取得收入的途径有：

1. 喜欢传统中国艺术的海外华人，我了解这样的人还不少(以前的同事中就有)，他们有购买欲望，也有购买能力，并且这样“超高清”的图片目前还没有别的应用能提供。
2. 国内用户基本不会付费购买，但是如果做的好可以扩展到书画宣传和交易，承接给土豪画家做画册的项目， 
这个目前是冷门，并且有比较高的回报。而且，我们有一定的社会资源，和书画界还有点关系。退一步说，
就是找不到土豪做画册，至少家藏字画可以做做宣传。:)

竞争分析
--------------------------------------
1. 目前Android平台上没有一个专业的中国古典艺术图片分享APP，有的都是粗糙的一些简单的打包图片下载APP
2. 虽然没有这个类型的应用，并不代表没有市场，现在能找到的一个做的最好的APP，是日本人做的e-Musum
3. 在iOS平台上，也有e-Musum，还有很多西方艺术品的分享APP，一样没有分享中国艺术品的，恐怕国内很多开发公司还没注意到这个角落
4. 不过，这种类型的应用不会有太大的下载量，预期整个能有2W个活跃用户就足够了，恐怕也不会挣到多少钱，但是她一定是有价值的，哪怕光从扩大中国古典艺术影响这个角度说，也很值得。不能光让全世界认为只有日本人才重视古典艺术呀

 
V0.1 需求
==========

前台基本功能
-----------------
图片展示:

1. 可以展示高清晰度的艺术图片, 支持缩放和拖动，要平滑和快速
2. 为了减少内存占用和加快装入速度，图片要能分块载入，能同时下载一个图片的不同区域
3. 缩放时支持分层载入不同分辨率的图片，放大的级别越高，载入越大分辨率的图片
4. 高分辨率的图片从云盘上下载，通过HTTP协议下载

图片分类:

1. 图片按照多个类别进行分类列表，类别包括： 作者，年代，艺术形式
2. 文字形式展示图片元信息，元信息包括：作者，年代，作品名称，简介
3. 初始安装包中包含每个类别的前10张低分辨率图片, 每张大小约50K,
4. 首次打开可以看到全部的分类和每张图片的缩略图,所以需要在安装包中包含所有分类信息和图片的元信息,以及每张图片的缩略图
5. 检查云盘上的版本文件是否比当前的高，如果高，就下载新的定义文件
6. 新的图片类别和图片列表，以及元信息，也从云盘上读取，访问云盘用HTTP协议
 
其他功能:

1. 可以分享图片到各个社交媒体,分享的内容是一张缩略图和一个链接
2. 可以加书签，通过书签可以快速的跳转到某个特定的图片，可以保存到相册
3. 可以仿造Android应用 e-Museum
4. 可以提交统计信息到统计服务器，用来分析用户访问时间，用户打开次数等
 
后台基本功能
-----------------

1. 分层切分图片，并组织好放到7牛云盘目录下
2. 管理类别定义文件
3. 管理版本文件，客户端通过版本文件确定是否需要重新下载类别定义文件
4. 保存用户的书签
5. 用户分享事记录用户信息

技术参考资料
------------------

1. 图片缩放控件，实现分块，分层图片控制： https://github.com/sanli/TileView

