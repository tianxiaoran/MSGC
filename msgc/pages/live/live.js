$(function () {
  // 存放当前页:
  let pno = 1
  let lock = false // 锁的状态, 默认是 未锁定
  // 是否有更多
  let hasMore = true

  function getData(page) {
    // 判断是否已锁定, 如果锁定则什么都不做
    if (lock) return
    // 判断: 有更多 再发请求;  没有 则终止执行
    if (!hasMore) return

    lock = true // 锁定
    // type: 数据类型;   ms美食; yz:颜值; ecy: 二次元
    var url = `https://douyu.xin88.top/api/room/list?page=${page}&type=yz`

    $.get(url, data => {
      console.log(data)
      // html(): 底层是 innerHTML = ; 会覆盖原有内容
      // append: 新增
      $('.list').append(
        data.data.list.map(value => {
          const { roomSrc, roomName, nickname, hn } = value

          return `<li>
        <div>
          <img src="${roomSrc}" alt="">
          <span class="hn">${hn}</span>
          <span class="nickname">${nickname}</span>
        </div>
        <p>${roomName}</p>
      </li>`
        })
      )

      const { nowPage, pageCount } = data.data

      // 如果是最后一页
      if (nowPage == pageCount) {
        $('.loadmore').text("没有更多了")
        hasMore = false //没有更多
      }

      pno = nowPage //更新当前页
      // 解锁
      lock = false

      // 特例: 由于此接口一页给的数据过少, 导致首页无法滚动
      // 判断: 如果是第一页, 则直接请求第二页
      if (nowPage == 1) getData(2)

    })
  }

  getData(1)

  // 触底加载更多的思想: 监听页面的滚动距离, 当要到底的时候, 就触发下一页的请求
  // 然后把请求到的数据, 累加到之前的已有数据上
  $(window).scroll(function () {
    // 滚动距离
    var st = $(window).scrollTop()
    var win_h = $(window).height()
    //内容高
    var content_h = $(document).height()
    // console.log('滚动距离', st)
    // console.log('窗口高', win_h)
    // console.log('内容高', content_h);
    // 触底时: 内容高 - 窗口高 = 滚动距离

    // 问题: 如果正在发送请求, 就不能触发下一次
    // 例如: 亮亮在蹲坑, 请问: 怎么防止这个坑 不会被别人同时使用?
    // 加锁: 使用时, 判断是否锁定; 如果没锁定, 则可以使用 并加锁. 用完之后解锁

    // st+150: 代表给滚动距离 +150. 提前150px 触发加载更多
    if (content_h - win_h <= st + 150) {
      getData(pno + 1)
    }
  })
})