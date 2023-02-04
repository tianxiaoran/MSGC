$(function () {
  var url = 'https://serverms.xin88.top/index'

  $.get(url, data => {
    console.log(data)
    const { hot_video, index_items, today_hot, today_meal } = data

    // hot_video: 头部的视频
    // 使用时, 图片和视频需要拼接路径才能看到, 具体看 assets 目录 
    $('.top ul').html(
      hot_video.map(value => {
        const { mp4, pic, vname } = value

        // 关闭预加载, 节省用户流量, 提高体验
        return `<li>
          <video src="./assets/video/${mp4}" poster="./assets/img/${pic}" preload="none"></video>

          <div>
            <i style="background-image: url(./assets/img/979.png);"></i>
            <strong>${vname}</strong>
          </div>
        </li>`
      })
    )

    // today-hot
    $('.today-hot>ul').html(
      today_hot.map(value => {
        const { name, emphasize } = value

        return `<li><a class="${emphasize ? 'active' : ''}" href="?p=search&kw=${name}">${name}</a></li>`
      })
    )

    // index-items
    $('.index-items').html(
      index_items.map(value => {
        const { title, items } = value

        const x = items.map(value => {
          const { desc, pic, title, author } = value
          return `<li>
            <div>
              <img src="./assets/img/food/${pic}" alt="">
              <span>${author}</span>
            </div>
            <strong>${title}</strong>
            <p class="line-1">${desc}</p>
          </li>`
        }).join('')

        return `<h2>${title}</h2>
        <ul>${x}</ul>`
      })
    )

    // today_meal
    today_meal.forEach((item, index) => {
      const { cate_name, contents } = item

      $('.today-meal>div>ul').append(`
        <li class="${index == 0 ? 'active' : ''}">${cate_name}</li>
      `)

      contents.forEach(value => {
        const { desc, pic, title } = value

        $('.today-meal .swiper-wrapper').append(`
        <div class="swiper-slide">
          <img src="./assets/img/food/${pic}" alt="">
          <strong>${title}</strong>
          <p>${desc}</p>
        </div>`)

      })
    })
  })

  // swiper初始化
  var mySwiper = new Swiper('.swiper', {
    slidesPerView: 3,
    slidesPerGroup: 3,
    spaceBetween: 10,
    on: {
      slideChange() {
        // activeIndex: 当前激活的轮播项序号
        $('.today-meal li').eq(this.activeIndex / 3).click()
      }
    }
  })

  $('.today-meal').on('click', 'li', function () {
    $(this).addClass('active').siblings().removeClass('active')
    const i = $(this).index()
    mySwiper.slideTo(i * 3)
  })

  // 异步增加
  $('.top').on('click', 'video', function () {
    if (this.paused) {
      $('.top video').trigger('pause').css('filter', 'blur(2px)')
      // 显示所有的遮罩, 再单独隐藏当前的
      $('.top li>div').show()

      // 遮罩: 属于播放器的兄弟元素
      $(this).siblings().hide()

      $(this).trigger('play').css('filter', 'blur(0)')
        .parent().stop().animate({ width: 332 })
        .siblings().stop().animate({ width: 212 })
    } else {
      // 暂停时, 显示遮罩
      $(this).siblings().show()

      $(this).trigger('pause').css('filter', 'blur(2px)')
      // 暂停时,所有元素都回归正常大小
      $('.top li').stop().animate({ width: 242 })
    }
  })

  // 定时器切换动画
  setInterval(() => {
    $('.main>.box>div:last-child').toggleClass('active')
  }, 5000);
})