'use strict';
 /*jshint unused:false*/

(function ($, window, document, undefined) {
var App;
var endFrame = 14,
    appLang = $('html').attr('lang'),
    $body = $('body'),
    wH, wW, pixelDensity = window.devicePixelRatio || 1,
    dragging = !1,
    scrolling = !1,
    transitioning = !1,
    transitionTimer, 
    onResizeTimer, 
    mobile = /iPhone|iPad|iPod|Android|webOS|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ? !0 : !1,
    isIE9 = $('html').hasClass('ie9') ? !0 : !1,
    isiOS = navigator.userAgent.match(/(iPad|iPhone|iPod)/g) ? !0 : !1,
    isiOS8 = navigator.userAgent.match(/(iPad|iPhone|iPod).*OS 8_\d/i),
    isChrome = navigator.userAgent.indexOf('Chrome') > -1,
    isExplorer = navigator.userAgent.indexOf('MSIE') > -1,
    isFirefox = navigator.userAgent.indexOf('Firefox') > -1,
    isSafari = navigator.userAgent.indexOf('Safari') > -1,
    isOpera = navigator.userAgent.indexOf('Presto') > -1;
var mousewheelevt = /Firefox/i.test(navigator.userAgent) ? 'DOMMouseScroll' : 'wheel',
    sections = [],
    currentSection = 0,
    trValues = [],
    listItems = $('#sliders section'),
    stripe = document.getElementById('stripe'),
    iPhone = $('#video-container'),
    largeScreen = $('#large-video'),
    wideContent = $('#wide-content'),
    dayScreens = $('#day-screens'),
    sliderTitles = $('#titles'),
    sliderSection = $('#titles h3 span'),
    videoElem = $('#video'),
    videoElemTwo = $('#video2'),
    videoElemFour = $('#video4'),
    video = $('#video')[0],
    videoTwo = $('#video2')[0],
    videoThree = $('#video3')[0],
    videoFour = $('#video4')[0],
    timelineCtn = $('#timeline-ctn'),
    tabletScroll = new TabletScroll(),
    forward, wideContentTransVal, largeScreenTransVal, iPhoneTransVal, slider, lastSwipeProgress, lastViableProgress, slidesNumber, touchmoveDisabled = !1;


  $(function () { App.init(); });

  /*
  [-------- Application -------]
  */
	App = {
        isDebug : true,
        landscape : true,
		swiperSettings: 0,
		splashFaders:false,
		init : function() {

			App.setDefaults();

		},
		setDefaults: function() {
            App.layoutSettings();
			App.scrollHandlers();
            App.eventHandlers();
            //init Navigation
            $('section').each(function(e) {
                sections[e] = new App.Section(e);
            }), App.getTransitionValues();

		},
        layoutSettings : function() {
            var links = $('#hero a');
           /* var tween = TweenMax.to( '#hero a',  1, {
                y:'-300%', 
                ease:Linear 
            },0.5);         */
            setTimeout(function() {
                links.css('transform','translateY(0%)');
            },750);
            //layout Settings
            App.setHeightOther(),
            wW = window.innerWidth, 
            wH = $(window).height(),
            wideContentTransVal = -wideContent.height() - (wH - wideContent.height()) / 2,
            largeScreenTransVal = -largeScreen.height() - (wH - largeScreen.height()) / 2,
            iPhoneTransVal = -iPhone.height() - (wH - iPhone.height()) / 2, 
            740 >= wW ? slider || App.initSlider() : slider && (slider.destroy(), 
            slider = null, 
            $('.swiper-slide').width('')), 
            mobile && (wW > 740 && !touchmoveDisabled ? tabletScroll.init() : tabletScroll.kill());
            console.log(mobile,wideContentTransVal, largeScreenTransVal, iPhoneTransVal);

        },
		eventHandlers : function(){

			$('body').on('click touchend', '#home-btn', function(event){
				event.preventDefault();
				location.href= 'index.html';
			});

            //left hand chapter clicks
            $('body').on('click touchend', '#titles ul li', function(event){
                event.preventDefault();
                var thisIndex = $(this).index();
                if(thisIndex === 1) {
                    var chapter2 = 5;
                    sections[chapter2].animate(true);
                    $body.attr('data-current-section', chapter2);
                    currentSection = chapter2;
                } else if(thisIndex === 2){
                    var chapter3 = 10;
                    sections[chapter3].animate(true);
                    $body.attr('data-current-section', chapter3);
                    currentSection = chapter3;
                } else if(thisIndex === 3){
                    var chapter4 = 11;
                    sections[chapter4].animate(true);
                    $body.attr('data-current-section', chapter4);
                    currentSection = chapter4;
                } else {
                    sections[thisIndex].animate(true);
                    $body.attr('data-current-section', 0);
                    currentSection = 0;

                }
            });

			$('body').on('click touchend', '#down', function(event){
				event.preventDefault();
				App.goToSection('#intro', 25);
			});

			$('body').on('click touchend', '#down-intro', function(event){
				event.preventDefault();
				App.goToSection('#sliders',-50);
			});

            $(window).resize(function() {
                //ensure content centers on resize
                App.setHeightOther(),
                App.layoutSettings(),  
                App.getTransitionValues();
               // wW > 740 && (clearTimeout(onResizeTimer), 
                //onResizeTimer = setTimeout(function() {
                //    sections[currentSection].animate();
               // }, 100));
                if(wW < 740) {
                    $(document).unbind(mousewheelevt, App.mouseWheelHandler);
                    listItems.removeClass('current');
                }
                var distance = $('#sliders').offset().top -100,
                    $window = $(window);

            });
            $(document).keydown(function(e) {
                e.preventDefault();
                var t = [37, 38, 39, 40];
                if (!transitioning && -1 !== t.indexOf(e.which)) {
                    var i;
                    transitioning = !0, 37 === e.which || 38 === e.which ? currentSection > 0 && (currentSection--, i = !1) : currentSection < sections.length - 1 && (currentSection++, i = !0), sections[currentSection].animate(i);
                }
            });
     	},

        goToSection: function(id,offSet) {
            $('html, body').animate({
                scrollTop: $(id).offset().top + offSet
            }, 500);
        },


		setHeightOther: function () {
            //ensure height adjusts on resize
            //console.log('setting - height');
			var windowHeightminus = $(window).height() - 50;
			var windowHeightPlus = $(window).height() + 25;
			var windowHeight = $(window).height();

			var heroContent = $('#hero .main-content').outerHeight(true);
			if (windowHeightminus > heroContent) {
				$('#wrapper>section#hero').css('height', windowHeightminus);
			} else {
			   $('#wrapper>section#hero').css('height', heroContent); 
			}

            var introContent = $('#intro .main-content').outerHeight(true);
            if (windowHeight > introContent) {
               // console.log(windowHeight);
                $('#wrapper>section#intro').css('height', windowHeightPlus);
            } else {
                //console.log(introContent);
               $('#wrapper>section#intro').css('height', introContent); 
            }

            var sliderContent = $('#sliders .main-content').outerHeight(true);
            if (windowHeightminus > sliderContent) {
                $('#wrapper>section#sliders').css('height', windowHeightminus);
            } else {
               $('#wrapper>section#sliders').css('height', sliderContent); 
            }

            var contactContent = $('#contact .main-content').outerHeight(true);
            if (windowHeightminus > contactContent) {
                $('#wrapper>section#contact').css('height', windowHeightminus);
            } else {
               $('#wrapper>section#contact').css('height', contactContent); 
            }
		},

        scrollHandlers: function() {

                var easing = {
                    // no easing, no acceleration
                    linear: function(t) {
                        return t;
                    },
                };

                // header minifies on scroll
                var scrolltimeout = null;
                var scrolldelta = Math.round(document.body.scrollTop || document.documentElement.scrollTop || 0);
                var scrolltemp = 0;
                var prevscroll = window.scrollY;
                var down = document.querySelectorAll('.down')[0];
                down.hider = false;
                down.trigger = 150;
                var heroimage = document.querySelectorAll('#hero img');

                function downCheck() {
                    if (!down.hider) {
                        if (scrolldelta > down.trigger) {
                            down.classList.add('fade');
                            setTimeout(function() {
                                down.classList.add('hide');
                            }, 500);
                            down.hider = true;
                        }
                    } else {
                        if (scrolldelta < down.trigger) {
                            down.classList.remove('hide');
                            setTimeout(function() {
                                down.classList.remove('fade');
                            }, 100);
                            down.hider = false;
                        }
                    }
                }

                window.onscroll = function() {
                    scrolltemp = document.body.scrollTop || document.documentElement.scrollTop || 0;
                    scrolltemp = prevscroll - scrolltemp;
                    scrolldelta -= scrolltemp;
                    var herotemp = scrolldelta / 2.4;
                    if (herotemp < 0) {
                        herotemp = 0;
                    }
                    downCheck();
                    for (var i = 0; i < heroimage.length; i++) {
                        if(wW >= 769 ) {
                            heroimage[i].style.transform = 'translateY(' + herotemp + 'px)';
                        } else {
                            heroimage[i].style.transform =  'scale(3)';
                        }
                    }
					var distanceY = window.pageYOffset || document.documentElement.scrollTop,
					    shrinkOn = $('#intro').offset().top-75,
                        bindMouseWheel = $('#sliders').offset().top-50,
                        startVideo = $('#sliders').offset().top-150,
					    header = document.querySelector('header'),
                        headerLogo = document.querySelector('.logo'),
                        centerTitle = document.querySelector('.title');

					if (distanceY > shrinkOn) {
					    classie.add(header,'smaller');
                        //classie.add(headerLogo, 'hidden');
                        //classie.remove(centerTitle, 'center-title');
					} else {
					    if (classie.has(header,'smaller')) {
					        classie.remove(header,'smaller');
                            //classie.remove(headerLogo, 'hidden');
                           // classie.add(centerTitle, 'center-title');
					    }
					}
                    if (distanceY > startVideo) {
                        playVideoTwo();
                    }
                    if (distanceY > bindMouseWheel) {
                        if (wW > 740) {
                            if(currentSection === 0 && $body.attr('data-started') === 'false' && $body.attr('data-forward') === 'true' || $body.attr('data-restart') === 'true'){
                                //console.log('mouse wheel bound');
                                //App.goToSection('#sliders',-50);
                                $('#sliders').css({'position': 'fixed', 'top': '0px','z-index':'20'})
                                setTimeout(function() {
                                    $body.attr('data-started',true),
                                    $body.attr('data-forward',true),
                                    $('.swiper-container, #sections-list').addClass('z-index20');
                                    $(document).bind(mousewheelevt, App.mouseWheelHandler);
                                },750);
                            }
                            if(currentSection === endFrame && $body.attr('data-ended') === 'true') {
                                setTimeout(function() {
                                    $('#sliders').css({'position': 'relative', 'top': 'auto','z-index':'1'})
                                    $body.attr('data-started',true),
                                    $body.attr('data-forward',true),// data restart ?
                                    $(document).unbind(mousewheelevt, App.mouseWheelHandler);
                                    //revise for end of animation scrolling back
                                    //perhaps set everything to 10 & lock
                                   //console.log('restart animation');
                                    //currentSection = 0;
                                    //sections[0].animate(false);
                                    //$body.attr('data-current-section', 0);
                                    //$(document).bind(mousewheelevt, App.mouseWheelHandler);
                                    //App.goToSection('#sliders',-50);

                                },750);

                            }
                        }
                    }

                    prevscroll = document.body.scrollTop || document.documentElement.scrollTop || 0;
                };

                //downCheck();

        },
        mouseWheelHandler: function(e) {
            /* jshint expr: true */
            e.preventDefault();
            if (wW > 740) {
                //console.log(wW);
                var winEvent = window.event || e,
                    winEvent = winEvent.originalEvent ? winEvent.originalEvent : winEvent,
                    i = 'wheel' === winEvent.type ? winEvent.wheelDelta : -40 * winEvent.detail;
                if (!transitioning) {
                    //console.log('not transitioning');
                    winEvent.preventDefault();
                    var n;
                    i > 0 ? currentSection > 0 && (currentSection--, n = !1) : 0 > i && currentSection < sections.length - 1 && (currentSection++, n = !0), 
                    0 !== i && (transitioning = !0, sections[currentSection].animate(n));
                   // console.log(n,currentSection, i);
                }
            }
        },
        scrollTo: function(Y, duration, easingFunction, callback) {
            var start = Date.now();
            var from = document.body.scrollTop || document.documentElement.scrollTop || 0;

            if (from === Y) {
                return; /* Prevent scrolling to the Y point if already there */
            }

            function min(a, b) {
                return a < b ? a : b;
            }

            function scroll() {
                var currentTime = Date.now(),
                    time = min(1, ((currentTime - start) / duration)),
                    easedT = easingFunction(time);

                var tempscroll = (easedT * (Y - from)) + from;
                document.body.scrollTop = tempscroll;
                document.documentElement.scrollTop = tempscroll;

                if (time < 1) {
                    requestAnimationFrame(scroll);
                } else {
                    if (callback) {
                        callback();
                    }
                }
            }
            requestAnimationFrame(scroll);
        },
        Section: function(e) {
            /* jshint expr: true */
            var t = this;
            t.index = e, 
            t.DOMel = $('section').eq(e), 
            t.article = 
            t.DOMel.find('article'),
            t.title = t.DOMel.find('h2'), 
            t.paragraph = t.DOMel.find('p'), 
            t.animate = function(e, i) {
                /* jshint expr: true */
                0 === currentSection ? $body.removeClass('started') : $body.addClass('started'), 
                $body.attr('data-forward', e),
                $body.attr('data-started', true),
                $body.attr('data-current-section', currentSection),
                listItems.removeClass('current'), 
                $('.nav-btn').prop('disabled', !1), 
                0 === currentSection && $('.nav-btn.up').prop('disabled', !0), 
                currentSection === sections.length - 1 && $('.nav-btn.down').prop('disabled', !0);
                var n = e ? trValues[t.index].article.delay.forward : trValues[t.index].article.delay.backward;
                console.log('currentSection', currentSection);
                //if last section unbind mousewheel control & remove absolute positioning
                if(currentSection === endFrame){
                    $body.attr('data-started', false);
                    $body.attr('data-ended', true);
                }

                if (i) {
                    var r = stripe._gsTransform ? stripe._gsTransform.rotation : 0;
                    //console.log(r);
                    TweenMax.to(
                        iPhone, 
                        trValues[t.index].iPhone.duration, 
                        trValues[t.index].iPhone.values), 
                        r / 180 % 2 !== 0 ? TweenMax.to(stripe, 0.5, {
                        delay: 0.2,
                        y: 0,
                        scaleX: 1.3,
                        force3D: !0,
                        ease: Sine.easeIn,
                        onComplete: function() {
                            TweenMax.to(stripe, 0, trValues[t.index].stripe.values);
                        }
                    }) : TweenMax.to(stripe, 0.5, {
                        delay: 0.2,
                        y: -wH,
                        scaleX: 1.3,
                        force3D: !0,
                        ease: Sine.easeIn,
                        onComplete: function() {
                            TweenMax.to(stripe, 0, trValues[t.index].stripe.values);
                        }
                    });
                } else  {
                    //console.log('else'); 
                }
                //TweenMax.set(".tween-center", {xPercent:-50, yPercent:-50});
                TweenMax.to(
                    sliderTitles, 
                    trValues[t.index].sliderTitles.duration, 
                    trValues[t.index].sliderTitles.values
                ),
                //fromTo to expand and contract height of stripe
                TweenMax.to(
                    stripe, 
                    trValues[t.index].stripe.duration, 
                    trValues[t.index].stripe.values
                ), 
                TweenMax.to(
                    iPhone, 
                    trValues[t.index].iPhone.duration, 
                    trValues[t.index].iPhone.values
                ),
                TweenMax.to(
                    largeScreen,
                    trValues[t.index].largeScreen.duration, 
                    trValues[t.index].largeScreen.values
                );
                TweenMax.to(
                    wideContent,
                    trValues[t.index].wideContent.duration, 
                    trValues[t.index].wideContent.values
                );
                TweenMax.to(
                    dayScreens,
                    trValues[t.index].dayScreens.duration, 
                    trValues[t.index].dayScreens.values
                );
                TweenMax.to(timelineCtn, 0.4, {
                    delay: 0,
                    scaleX: 0,
                    force3D: !0,
                    ease: Quad.easeInOut,
                    onComplete: function() {
                        //console.log($body.attr('data-started'),$body.attr('data-forward'),currentSection);
                        setTimeout(function() {
                            if( ($body.attr('data-started') === 'true') && ($body.attr('data-forward') === 'false') && (currentSection === 0)) {
                                //console.log('animation at start unbind');
                                $('#sliders').css({'position': 'relative', 'top': 'auto','z-index':'1'});
                                $(document).unbind(mousewheelevt, App.mouseWheelHandler);
                                $body.attr('data-started',false);
                                setTimeout(function() {
                                    $body.attr('data-restart',true);
                                },1000);
                                return;
                            }
                            if( ($body.attr('data-started') === 'false') && ($body.attr('data-forward') === 'true') && (currentSection === endFrame)) {
                                $(document).unbind(mousewheelevt, App.mouseWheelHandler);
                                return;
                            }
                        },750);
                        timelineCtn.removeClass('glowing'),
                        TweenMax.to(stripe, 0, trValues[t.index].stripe.returns), 
                        TweenMax.to(timelineCtn, 0, trValues[t.index].timelineCtn.values), 
                        TweenMax.to('#timeline-bar', 0, trValues[t.index].timeline.values), 
                        TweenMax.to(timelineCtn, 0.6, {
                            scaleX: 1,
                            force3D: !0,
                            ease: Quad.easeOut,
                            onComplete: function() {
                                timelineCtn.addClass('glowing');
                            }
                        }), transitionTimer = setTimeout(function() {
                            transitioning = !1;
                        }, 1500), 
                        t.index < sections.length - 1 && wW > 740 && ($(video).unbind('timeupdate'), 
                        setTimeout(function() {
                            sliderTitles.find('h1').text(trValues[t.index].sliderTitles.title);
                            sliderTitles.find('h3 span').text(trValues[t.index].sliderTitles.number);
                            sliderTitles.find('.copy div:first-child').text(trValues[t.index].sliderTitles.first);
                            sliderTitles.find('.copy div:last-child').text(trValues[t.index].sliderTitles.last);
                            if(trValues[t.index].video) {
                                $('#image-load').css('display','none');
                                videoElem.addClass('z-index20');

                                  videoElem.fadeTo(500,0.30, function() {
                                    videoElem.attr('src','assets/video/facebook-animation.mp4');
                                  }).fadeTo(500,1, function() {
                                    console.log('fade in and play');
                                    video.currentTime = trValues[t.index].video.start, 
                                    video.play();
                                  });
                                $(video).bind('timeupdate', function() {
                                    this.currentTime >= trValues[t.index].video.end && this.pause();
                                });
                              //return false;
                            }
                            if(trValues[t.index].instaVideo) {
                                $('#image-load').css('display','none');
                                videoElem.addClass('z-index20');
                                videoElem.fadeTo(500,0.30, function() {
                                    videoElem.attr('src','assets/video/instagram.mp4');
                                }).fadeTo(500,1, function() {
                                    video.currentTime = trValues[t.index].instaVideo.start, 
                                    video.play();

                                });
                                $(video).bind('timeupdate', function() {
                                    this.currentTime >= trValues[t.index].instaVideo.end && this.pause();
                                });
                                  //return false;
                            }
                            if(trValues[t.index].loadVideoTwo) {
                                videoElemTwo.fadeTo(500,0.30, function() {
                                    videoElemTwo.attr('src','assets/video/wembley.mp4');
                                }).fadeTo(500,1, function() {
                                    videoTwo.currentTime = trValues[t.index].loadVideoTwo.start, 
                                    videoTwo.play();

                                });
                                $(video).bind('timeupdate', function() {
                                    this.currentTime >= trValues[t.index].loadVideoTwo.end && this.pause();
                                });
                            }
                            if(trValues[t.index].videoTwo) {
                                $('#video2').addClass('z-index20');
                                videoTwo.currentTime = trValues[t.index].videoTwo.start, 
                                videoTwo.play(), 
                                $(videoTwo).bind('timeupdate', function() {
                                    this.currentTime >= trValues[t.index].videoTwo.end && this.pause();
                                });
                            }
                            if(trValues[t.index].videoThree) {
                                $('#video3').addClass('z-index20').css('opacity','1');
                                videoThree.currentTime = trValues[t.index].videoThree.start, 
                                videoThree.play(), 
                                $(videoThree).bind('timeupdate', function() {
                                    this.currentTime >= trValues[t.index].videoThree.end && this.pause();
                                });
                            }
                            if(trValues[t.index].videoFour) {
                                console.log('video 4 load', videoFour, video);
                                $('#video4').addClass('z-index20').css('opacity','1');
                                videoFour.currentTime = trValues[t.index].videoFour.start, 
                                videoFour.play(), 
                                $(videoFour).bind('timeupdate', function() {
                                    this.currentTime >= trValues[t.index].videoFour.end && this.pause();
                                });
                            }
                            if(trValues[t.index].imageAnimate) {
                                $('#image-load').css('display','block');
                                videoElem.removeClass('z-index20');
                                var url = 'assets/img/sliders/sequence-' + trValues[t.index].imageAnimate.img + '.jpg';
                                //$('#image-load').attr('src','../assets/img/sliders/sequence-' + trValues[t.index].imageAnimate.img + '.jpg');
                                //console.log(video);
                                    videoElem.css('display','none');
                                  $('#image-load').fadeTo(500,0.30, function() {
                                      $('#image-load').attr('src',url);
                                  }).fadeTo(500,1, function() {
                                    videoElem.css('display','block');

                                  });
                                  return false;

                            }
                            if(trValues[t.index].wideImageAnim) {
                                $('#video3').removeClass('z-index20').css('opacity','0');
                                var url = 'assets/img/sliders/wide-content' + trValues[t.index].wideImageAnim.img + '.jpg';
                                //$('#image-load').attr('src','../assets/img/sliders/sequence-' + trValues[t.index].imageAnimate.img + '.jpg');
                                //console.log(video);
                                    $('#video3').css('display','none');
                                  $('#image-load-wide').fadeTo(500,0.30, function() {
                                      $('#image-load-wide').attr('src',url);
                                  }).fadeTo(500,1, function() {
                                    $('#video3').css('display','block');

                                  });
                                  return false;

                            }
                        }, 500));
                    }
                }), 
                setTimeout(function() {
                    //console.log('current classes', t.index);
                    listItems.eq(t.index).addClass('current'), 
                    $('#main-nav li').removeClass('current'), 
                    t.index > 0 && $('#main-nav li').eq(t.index - 1).addClass('current');
                }, n);
            };

        },
        getTransitionValues: function () {
            //Green Sock step by step animation
            trValues[0] = {
                stripe: {
                    duration: 0.5,
                    values: {
                        backgroundColor:'#4f67e5',
                        delay: 0,
                        y: 0,
                        rotationZ: 0,
                        scaleX: 1,
                        force3D: !0,
                        ease: Quad.easeInOut
                        
                    },
                    returns: {
                        backgroundColor:'#4f67e5',
                        delay: 0,
                        y: 0,
                        rotationZ: 0,
                        scaleX: 1,
                        force3D: !0,
                        ease: Quad.easeInOut
                    }
                },
                wideContent: {
                    duration: 0,
                    values: {
                        delay: 0.9,
                        y: '-250%',
                        rotationZ: 0,
                        ease: Quad.easeInOut
                    }
                },
                dayScreens: {
                    duration: 0.9,
                    values: {
                        delay: 0.9,
                        y:'-350%',
                    },
                },
                sliderTitles: {
                    duration: 0.5,
                    values: {
                        color:'#4f67e5'
                    },
                    title:'awareness',
                    number:'01',
                    verticalOne:'28 DAYS',
                    verticalTwo:'UNTIL THE FINAL',
                    first:'The FA Cup Semi-Finals have concluded,',
                    last:'there are 28 days left until the final.'
                },
                iPhone: {
                    duration: 0.5,
                    values: {
                        delay: 0.7,
                        y: '150%',
                        rotationZ: -15,
                        force3D: !0,
                        ease: Quad.easeInOut
                    }
                },
                largeScreen: {
                    duration: 0.8,
                    values: {
                        delay: 0.9,
                        x: '-50%',
                        y: '-45%',
                        rotationZ: 0,
                        force3D: !0,
                        ease: Quad.easeInOut

                    }
                },
                article: {
                    delay: {
                        forward: 0,
                        backward: 0
                    }
                },
                timelineCtn: {
                    duration: 0.5,
                    values: {
                        delay: 0,
                        y: 0,
                        opacity: 0,
                        force3D: !0,
                        ease: Quad.easeInOut
                    }
                },
                timeline: {
                    duration: 0.5,
                    values: {
                        delay: 0,
                        x: 0,
                        force3D: !0,
                        ease: Quad.easeInOut
                    }
                },
                videoTwo: {
                    start: 0,
                    end: 27
                }
            }, 
            trValues[1] = {
                stripe: {
                    duration: 1.3,
                    values: {
                        backgroundColor:'#4f67e5',
                        delay: 0,
                        y: 0,
                        rotationZ: 0,
                        scaleY: 5,
                        force3D: !0,
                        ease: Quad.easeInOut
                    },
                    returns: {
                        backgroundColor:'#4f67e5',
                        delay: 2,
                        y: 0,
                        rotationZ: 0,
                        scaleX: 1,
                        force3D: !0,
                        ease: Quad.easeInOut
                    }
                },
                dayScreens: {
                    duration: 0.9,
                    values: {
                        delay: 0.9,
                        y:'-350%',
                    },
                },
                wideContent: {
                    duration: 0,
                    values: {
                        delay: 0.9,
                        y: '-250%',
                        rotationZ: 0,
                        force3D: !0,
                        ease: Quad.easeInOut
                    }
                },
                sliderTitles: {
                    duration: 0.5,
                    values: {
                        css:{color:'#4f67e5'}
                    },
                    title:'awareness',
                    number:'01',
                    first:'The FA Cup Semi-Finals have concluded,',
                    last:'there are 28 days left until the final.'
                },
                iPhone: {
                    duration: 0.8,
                    values: {
                        delay: 0.3,
                        x: '-50%',
                        y: '-40%',
                        rotationZ: 0,
                        force3D: !0,
                        ease: Sine.easeInOut
                    }
                },
                largeScreen: {
                    duration: 0.8,
                    values: {
                        delay: 0.9,
                        //changed to large screen transval
                        y: '-350%',
                        rotationZ: -30,
                        force3D: !0,
                        ease: Quad.easeInOut

                    }
                },
                article: {
                    delay: {
                        forward: 600,
                        backward: 600
                    }
                },
                timelineCtn: {
                    duration: 0.8,
                    values: {
                        delay: 0.2,
                        y: 130,
                        rotationZ: 0,
                        opacity: 1,
                        force3D: !0,
                        ease: Quint.easeInOut
                    }
                },
                timeline: {
                    duration: 0.5,
                    values: {
                        delay: 0,
                        x: '25%',
                        force3D: !0,
                        ease: Quad.easeInOut
                    }
                },
                imageAnimate: {
                    img: '0',
                    duration: 0.5,
                    values: {
                        delay: 0,

                    }
                }
            },
            trValues[2] = {
                stripe: {
                    duration: 1.3,
                    values: {
                        backgroundColor:'#4f67e5',
                        delay: 0,
                        y: 0,
                        rotationZ: 0,
                        scaleY: 5,
                        force3D: !0,
                        ease: Quad.easeInOut
                    },
                    returns: {
                        backgroundColor:'#4f67e5',
                        delay: 2,
                        y: 0,
                        rotationZ: 0,
                        scaleX: 1,
                        force3D: !0,
                        ease: Quad.easeInOut
                    }
                },
                dayScreens: {
                    duration: 0.9,
                    values: {
                        delay: 0.9,
                        y:'-350%',
                    },
                },
                wideContent: {
                    duration: 0,
                    values: {
                        delay: 0.9,
                        y: '-250%',
                        rotationZ: 0,
                        force3D: !0,
                        ease: Quad.easeInOut
                    }
                },
                sliderTitles: {
                    duration: 0.5,
                    values: {
                        css:{color:'#4f67e5'}
                    },
                    title:'awareness',
                    number:'01',
                    first:'The FA Cup Semi-Finals have concluded,',
                    last:'there are 28 days left until the final.'
                },
                iPhone: {
                    duration: 0.8,
                    values: {
                        delay: 0.3,
                        x: '-50%',
                        y: '-40%',
                        rotationZ: 0,
                        force3D: !0,
                        ease: Sine.easeInOut
                    }
                },
                largeScreen: {
                    duration: 0.8,
                    values: {
                        delay: 0.9,
                        //changed to large screen transval
                        y: '-350%',
                        rotationZ: -30,
                        force3D: !0,
                        ease: Quad.easeInOut

                    }
                },
                article: {
                    delay: {
                        forward: 600,
                        backward: 600
                    }
                },
                timelineCtn: {
                    duration: 0.8,
                    values: {
                        delay: 0.2,
                        y: 130,
                        rotationZ: 0,
                        opacity: 1,
                        force3D: !0,
                        ease: Quint.easeInOut
                    }
                },
                timeline: {
                    duration: 0.5,
                    values: {
                        delay: 0,
                        x: '25%',
                        force3D: !0,
                        ease: Quad.easeInOut
                    }
                },
                imageAnimate: {
                    img: '1',
                    duration: 0.5,
                    values: {
                        delay: 0,

                    }
                }
            },
            trValues[3] = {
                stripe: {
                    duration: 1.3,
                    values: {
                        backgroundColor:'#4f67e5',
                        delay: 0,
                        y: 0,
                        rotationZ: 0,
                        scaleY: 5,
                        force3D: !0,
                        ease: Quad.easeInOut
                    },
                    returns: {
                        backgroundColor:'#4f67e5',
                        delay: 2,
                        y: 0,
                        rotationZ: 0,
                        scaleX: 1,
                        force3D: !0,
                        ease: Quad.easeInOut
                    }
                },
                dayScreens: {
                    duration: 0.9,
                    values: {
                        delay: 0.9,
                        y:'-350%',
                    },
                },
                wideContent: {
                    duration: 0,
                    values: {
                        delay: 0.9,
                        y: '-250%',
                        rotationZ: 0,
                        force3D: !0,
                        ease: Quad.easeInOut
                    }
                },
                sliderTitles: {
                    duration: 0.5,
                    values: {
                        css:{color:'#4f67e5'}
                    },
                    title:'awareness',
                    number:'01',
                    verticalOne:'28 DAYS',
                    first:'The FA Cup Semi-Finals have concluded,',
                    last:'there are 28 days left until the final.'
                },
                iPhone: {
                    duration: 0.8,
                    values: {
                        delay: 0.3,
                        x: '-50%',
                        y: '-40%',
                        rotationZ: 0,
                        force3D: !0,
                        ease: Sine.easeInOut
                    }
                },
                largeScreen: {
                    duration: 0.8,
                    values: {
                        delay: 0.9,
                        //changed to large screen transval
                        y: '-350%',
                        rotationZ: -30,
                        force3D: !0,
                        ease: Quad.easeInOut

                    }
                },
                article: {
                    delay: {
                        forward: 600,
                        backward: 600
                    }
                },
                timelineCtn: {
                    duration: 0.8,
                    values: {
                        delay: 0.2,
                        y: 130,
                        rotationZ: 0,
                        opacity: 1,
                        force3D: !0,
                        ease: Quint.easeInOut
                    }
                },
                timeline: {
                    duration: 0.5,
                    values: {
                        delay: 0,
                        x: '25%',
                        force3D: !0,
                        ease: Quad.easeInOut
                    }
                },
                imageAnimate: {
                    img: '2',
                    duration: 0.5,
                    values: {
                        delay: 0,

                    }
                },
                loadVideoTwo: {
                    start:0,
                    end:0
                }
            },
            trValues[4] = {
                stripe: {
                    duration: 1.3,
                    values: {
                        backgroundColor:'#4f67e5',
                        delay: 0,
                        y: 0,
                        rotationZ: 0,
                        scaleY: 5,
                        force3D: !0,
                        ease: Quad.easeInOut
                    },
                    returns: {
                        backgroundColor:'#4f67e5',
                        delay: 2,
                        y: 0,
                        rotationZ: 0,
                        scaleX: 1,
                        force3D: !0,
                        ease: Quad.easeInOut
                    }
                },
                dayScreens: {
                    duration: 0.9,
                    values: {
                        delay: 0.9,
                        y:'-350%',
                    },
                },
                wideContent: {
                    duration: 0,
                    values: {
                        delay: 0.9,
                        y: '-250%',
                        rotationZ: 0,
                        force3D: !0,
                        ease: Quad.easeInOut
                    }
                },
                sliderTitles: {
                    duration: 0.5,
                    values: {
                        css:{color:'#4f67e5'}
                    },
                    title:'awareness',
                    number:'01',
                    verticalOne:'28 DAYS',
                    verticalTwo:'UNTIL THE FINAL',
                    first:'The FA Cup Semi-Finals have concluded,',
                    last:'there are 28 days left until the final.'
                },
                iPhone: {
                    duration: 0.8,
                    values: {
                        delay: 0.3,
                        x: '-50%',
                        y: '-40%',
                        rotationZ: 0,
                        force3D: !0,
                        ease: Sine.easeInOut
                    }
                },
                largeScreen: {
                    duration: 0.8,
                    values: {
                        delay: 0.9,
                        //changed to large screen transval
                        y: '-350%',
                        rotationZ: -30,
                        force3D: !0,
                        ease: Quad.easeInOut

                    }
                },
                article: {
                    delay: {
                        forward: 600,
                        backward: 600
                    }
                },
                timelineCtn: {
                    duration: 0.8,
                    values: {
                        delay: 0.2,
                        y: 130,
                        rotationZ: 0,
                        opacity: 1,
                        force3D: !0,
                        ease: Quint.easeInOut
                    }
                },
                timeline: {
                    duration: 0.5,
                    values: {
                        delay: 0,
                        x: '25%',
                        force3D: !0,
                        ease: Quad.easeInOut
                    }
                },
                imageAnimate: {
                    img: '3',
                    duration: 0.5,
                    values: {
                        delay: 0,

                    }
                },
                loadVideoTwo: {
                    start:0,
                    end:0
                }
            }, 
            trValues[5] = {
                stripe: {
                    duration: 0.5,
                    values: {
                        backgroundColor:'#4f67e5',top:0,height:5000,
                        delay: 0,
                        y: 0,
                        rotationZ: 0,
                        scaleY: 5,
                        force3D: !0,
                        ease: Quad.easeInOut,
                    },
                    returns: {                        
                        css:{backgroundColor:'#ff5745',top:'65%'},
                        delay: 1,
                        y: 0,
                        rotationZ: 0,
                        scaleX: 1,
                        force3D: !0,
                        ease: Quad.easeInOut
                    }
                },
                dayScreens: {
                    duration: 0.9,
                    values: {
                        delay: 0.9,
                        y:'-350%',
                    },
                },
                wideContent: {
                    duration: 0,
                    values: {
                        delay: 0.9,
                        y: '-250%',
                        rotationZ: 0,
                        force3D: !0,
                        ease: Quad.easeInOut
                    }
                },
                sliderTitles: {
                    duration: 0.5,
                    values: {
                        css:{color:'#ff5745'},
                        delay:1
                    },
                    title:'excite',
                    number:'02',
                    verticalOne:'14 DAYS',
                    verticalTwo:'UNTIL THE FINAL',
                    first:'There are now 14 days to go, so we begin to',
                    last:'increase the anticipation for the cup final.'
                },
                iPhone: {
                    duration: 0.8,
                    values: {
                        delay: 0.9,
                        y: '-240%',
                        rotationZ: -15,
                        force3D: !0,
                        ease: Quad.easeInOut
                    }
                },
                largeScreen: {
                    duration: 0.8,
                    values: {
                        delay: 0.9,
                        rotationZ: 0,
                        x: '-50%',
                        y: '-45%',
                        force3D: !0,
                        ease: Quad.easeInOut

                    }
                },
                article: {
                    delay: {
                        forward: 600,
                        backward: 600
                    }
                },
                timelineCtn: {
                    duration: 0.5,
                    values: {
                        delay: 0,
                        y: -150,
                        force3D: !0,
                        ease: Quad.easeInOut
                    }
                },
                timeline: {
                    duration: 0.5,
                    values: {
                        delay: 0,
                        x: '50%',
                        force3D: !0,
                        ease: Quad.easeInOut
                    }
                }
            }, 
            trValues[6] = {
                stripe: {
                    duration: 1.3,
                    values: {
                        backgroundColor:'#ff5745',
                        delay: 0,
                        y: 0,
                        rotationZ: 0,
                        scaleY: 5,
                        force3D: !0,
                        ease: Quad.easeInOut,
                    },
                    returns: {                        
                        backgroundColor:'#ff5745',
                        delay: 1,
                        y: 0,
                        rotationZ: 0,
                        scaleX: 1,
                        force3D: !0,
                        ease: Quad.easeInOut
                    }
                },
                dayScreens: {
                    duration: 0.9,
                    values: {
                        delay: 0.9,
                        y:'-350%',
                    },
                },
                wideContent: {
                    duration: 0,
                    values: {
                        delay: 0.9,
                        y: '-250%',
                        rotationZ: 0,
                        force3D: !0,
                        ease: Quad.easeInOut
                    }
                },
                sliderTitles: {
                    duration: 0.5,
                    values: {
                        css:{color:'#ff5745'}
                    },
                    title:'excite',
                    number:'02',
                    verticalOne:'14 DAYS',
                    verticalTwo:'UNTIL THE FINAL',
                    first:'There are now 14 days to go, so we begin to',
                    last:'increase the anticipation for the cup final.'
                },
                iPhone: {
                    duration: 0.8,
                    values: {
                        delay: 0.9,
                        y: '-40%',
                        x: '-50%',
                        rotationZ: 0,
                        force3D: !0,
                        ease: Quad.easeInOut
                    }
                },
                largeScreen: {
                    duration: 0.8,
                    values: {
                        delay: 0.9,
                        rotationZ: 0,
                        y: '-350%',
                        force3D: !0,
                        ease: Quad.easeInOut

                    }
                },
                article: {
                    delay: {
                        forward: 600,
                        backward: 600
                    }
                },
                timelineCtn: {
                    duration: 0.5,
                    values: {
                        delay: 0,
                        y: 130,
                        force3D: !0,
                        ease: Quad.easeInOut
                    }
                },
                timeline: {
                    duration: 0.5,
                    values: {
                        delay: 0,
                        x: '75%',
                        force3D: !0,
                        ease: Quad.easeInOut
                    }
                },
                video: {
                    start: 0,
                    end: 30
                }
            }, 
            trValues[7] = {
                stripe: {
                    duration: 1.3,
                    values: {
                        backgroundColor:'#ff5745',
                        delay: 0,
                        y: 0,
                        rotationZ: 0,
                        scaleY: 5,
                        force3D: !0,
                        ease: Quad.easeInOut,
                    },
                    returns: {                        
                        backgroundColor:'#ff5745',
                        delay: 2,
                        y: 0,
                        rotationZ: 0,
                        scaleX: 1,
                        force3D: !0,
                        ease: Quad.easeInOut
                    }
                },
                dayScreens: {
                    duration: 0.9,
                    values: {
                        delay: 0.9,
                        y:'-350%',
                    },
                },
                wideContent: {
                    duration: 0.8,
                    values: {
                        delay: 0.9,
                        y: '-250%',
                        rotationZ: -45,
                        force3D: !0,
                        ease: Quad.easeInOut
                    }
                },
                sliderTitles: {
                    duration: 0.5,
                    values: {
                        css:{color:'#ff5745'}
                    },
                    title:'excite',
                    number:'02',
                    verticalOne:'14 DAYS',
                    verticalTwo:'UNTIL THE FINAL',
                    first:'There are now 14 days to go, so we begin to',
                    last:'increase the anticipation for the cup final.'
                },
                iPhone: {
                    duration: 0.7,
                    values: {
                        delay: 0,
                        y: '-40%',
                        x: '-50%',
                        rotationZ: 0,
                        force3D: !0,
                        ease: Quad.easeOut
                    }
                },
                largeScreen: {
                    duration: 0.8,
                    values: {
                        delay: 0.9,
                        y: '-350%',
                        force3D: !0,
                        ease: Quad.easeInOut
                    }
                },
                article: {
                    delay: {
                        forward: 600,
                        backward: 0
                    }
                },
                timelineCtn: {
                    duration: 0.5,
                    values: {
                        delay: 0,
                        y: 0,
                        opacity: 1,
                        force3D: !0,
                        ease: Quad.easeInOut
                    }
                },
                timeline: {
                    duration: 0.5,
                    values: {
                        delay: 0,
                        x: '100%',
                        force3D: !0,
                        ease: Quad.easeInOut
                    }
                },
                instaVideo: {
                    start: 0,
                    end: 5
                }
            }, 
            trValues[8] = {
                stripe: {
                    duration: 0.5,
                    values: {
                        backgroundColor:'#ff5745',
                        delay: 0,
                        y: 0,
                        rotationZ: 0,
                        scaleY: 5,
                        force3D: !0,
                        ease: Quad.easeInOut,
                    },
                    returns: {                        
                        backgroundColor:'#ff5745',
                        delay: 2,
                        y: 0,
                        rotationZ: 0,
                        scaleX: 1,
                        force3D: !0,
                        ease: Quad.easeInOut
                    }
                },

                dayScreens: {
                    duration: 0.9,
                    values: {
                        delay: 0.9,
                        y:'-350%',
                    },
                },
                wideContent: {
                    duration: 0.8,
                    values: {
                        delay: 0.9,
                        y:'-36%',
                        x: '-50%',
                        rotationZ: 0,
                        force3D: !0,
                        ease: Quad.easeInOut
                    }
                },
                sliderTitles: {
                    duration: 0.5,
                    values: {
                        color:'#ff3b20'
                    },
                    title:'excite',
                    number:'02',
                    verticalOne:'14 DAYS',
                    verticalTwo:'UNTIL THE FINAL',
                    first:'There are now 14 days to go, so we begin to',
                    last:'increase the anticipation for the cup final.'
                },
                iPhone: {
                    duration: 0.7,
                    values: {
                        delay: 0,
                        y: '150%',
                        rotationZ: 15,
                        force3D: !0,
                        ease: Sine.easeIn
                    }
                },
                largeScreen: {
                    duration: 0.8,
                    values: {
                        delay: 0.9,
                        y: '-350%',
                        force3D: !0,
                        ease: Quad.easeInOut
                    }
                },
                article: {
                    delay: {
                        forward: 0,
                        backward: 0
                    }
                },
                timelineCtn: {
                    duration: 0.5,
                    values: {
                        delay: 0,
                        y: 0,
                        scaleX: 0,
                        opacity: 0,
                        force3D: !0,
                        ease: Quad.easeInOut
                    }
                },
                timeline: {
                    duration: 0.5,
                    values: {
                        delay: 0,
                        x: '100%',
                        force3D: !0,
                        ease: Quad.easeInOut
                    }
                },
                wideImageAnim: {
                    img:'1',
                    duration: 0.5,
                    values: {
                        delay: 0,

                    }

                }

            },
            trValues[9] = {
                stripe: {
                    duration: 0.5,
                    values: {
                        backgroundColor:'#ff5745',
                        delay: 0,
                        y: 0,
                        rotationZ: 0,
                        scaleY: 5,
                        force3D: !0,
                        ease: Quad.easeInOut,
                    },
                    returns: {                        
                        backgroundColor:'#ff5745',
                        delay: 2,
                        y: 0,
                        rotationZ: 0,
                        scaleX: 1,
                        force3D: !0,
                        ease: Quad.easeInOut
                    }
                },
                wideContent: {
                    duration: 0.8,
                    values: {
                        delay: 0.9,
                        y:'-36%',
                        x: '-50%',
                        rotationZ: 0,
                        force3D: !0,
                        ease: Quad.easeInOut
                    }
                },
                dayScreens: {
                    duration: 0.9,
                    values: {
                        delay: 0.9,
                        y:'-350%',
                    },
                },
                sliderTitles: {
                    duration: 0.5,
                    values: {
                        color:'#ff3b20'
                    },
                    title:'excite',
                    number:'02',
                    verticalOne:'14 DAYS',
                    verticalTwo:'UNTIL THE FINAL',
                    first:'There are now 14 days to go, so we begin to',
                    last:'increase the anticipation for the cup final.'
                },
                iPhone: {
                    duration: 0.7,
                    values: {
                        delay: 0,
                        y: '150%',
                        rotationZ: 15,
                        force3D: !0,
                        ease: Sine.easeIn
                    }
                },
                largeScreen: {
                    duration: 0.8,
                    values: {
                        delay: 0.9,
                        y: '-350%',
                        force3D: !0,
                        ease: Quad.easeInOut
                    }
                },
                article: {
                    delay: {
                        forward: 0,
                        backward: 0
                    }
                },
                timelineCtn: {
                    duration: 0.5,
                    values: {
                        delay: 0,
                        y: 0,
                        scaleX: 0,
                        opacity: 0,
                        force3D: !0,
                        ease: Quad.easeInOut
                    }
                },
                timeline: {
                    duration: 0.5,
                    values: {
                        delay: 0,
                        x: '100%',
                        force3D: !0,
                        ease: Quad.easeInOut
                    }
                },
                wideImageAnim: {
                    img:'2',
                    duration: 0.5,
                    values: {
                        delay: 0,

                    }

                }

            },
            trValues[10] = {
                stripe: {
                    duration: 0.5,
                    values: {
                        backgroundColor:'#43db84',top:0,height:5000,
                        delay: 0,
                        y:0,
                        rotationZ: 0,
                        scaleY: 5,
                        force3D: !0,
                        ease: Quad.easeInOut,
                    },
                    returns: {                        
                        backgroundColor:'#43db84',top:'65%',
                        delay: 1,
                        y:0,
                        rotationZ: 0,
                        scaleX: 1,
                        force3D: !0,
                        ease: Quad.easeInOut
                    }
                },
                dayScreens: {
                    duration: 0.9,
                    values: {
                        delay: 0.9,
                        y:'-50%',
                        x: '-50%',
                    },
                },
                wideContent: {
                    duration: 0.8,
                    values: {
                        delay: 0.9,
                        y:'-250%',
                        rotationZ: 0,
                        force3D: !0,
                        ease: Quad.easeInOut
                    }
                },
                sliderTitles: {
                    duration: 0.5,
                    values: {
                        color:'#43db84'
                    },
                    title:'activate',
                    number:'03',
                    verticalOne:'EVENT',
                    verticalTwo:'DAY',
                    first:'The day of the FA Cup Final',
                    last:' '
                },
                iPhone: {
                    duration: 0.7,
                    values: {
                        delay: 0,
                        y: '150%',
                        rotationZ: 15,
                        force3D: !0,
                        ease: Sine.easeIn
                    }
                },
                largeScreen: {
                    duration: 0.8,
                    values: {
                        delay: 0.9,
                        y: '-350%',
                        force3D: !0,
                        ease: Quad.easeInOut
                    }
                },
                article: {
                    delay: {
                        forward: 2,
                        backward: 2
                    }
                },
                timelineCtn: {
                    duration: 0.5,
                    values: {
                        delay: 0,
                        y: 0,
                        scaleX: 0,
                        opacity: 0,
                        force3D: !0,
                        ease: Quad.easeInOut
                    }
                },
                timeline: {
                    duration: 0.5,
                    values: {
                        delay: 0,
                        x: '100%',
                        force3D: !0,
                        ease: Quad.easeInOut
                    }
                },
                videoFour: {
                    start:0,
                    end:26
                }
            },
            trValues[11] = {
                stripe: {
                    duration: 0.5,
                    values: {
                        backgroundColor:'#7543db',
                        top:0,
                        height:5000,
                        delay: 0,
                        y: 0,
                        rotationZ: 0,
                        scaleY: 5,
                        force3D: !0,
                        ease: Quad.easeInOut,
                    },
                    returns: {                        
                        backgroundColor:'#7543db',
                        delay: 1,
                        top:'65%',
                        y: 0,
                        rotationZ: 0,
                        scaleX: 1,
                        force3D: !0,
                        ease: Quad.easeInOut
                    }
                },
                dayScreens: {
                    duration: 0.9,
                    values: {
                        delay: 0.9,
                        y:'-350%',
                    },
                },
                wideContent: {
                    duration: 0.8,
                    values: {
                        delay: 0.9,
                        y:'-36%',
                        x: '-50%',
                        rotationZ: 0,
                        force3D: !0,
                        ease: Quad.easeInOut
                    }
                },
                sliderTitles: {
                    duration: 0.5,
                    values: {
                        css:{color:'#7543db'},
                        delay:1
                    },
                    title:'post-event',
                    number:'04',
                    verticalOne:'POST',
                    verticalTwo:'EVENT',
                    first:'The event still fresh on people’s minds,',
                    last:'A great time to reinforce the brand & establish loyalty between fan & event.'
                },
                iPhone: {
                    duration: 0.7,
                    values: {
                        delay: 0,
                        y: '150%',
                        rotationZ: 15,
                        force3D: !0,
                        ease: Sine.easeIn
                    }
                },
                largeScreen: {
                    duration: 0.8,
                    values: {
                        delay: 0.9,
                        y: '-350%',
                        force3D: !0,
                        ease: Quad.easeInOut
                    }
                },
                article: {
                    delay: {
                        forward: 0,
                        backward: 0
                    }
                },
                timelineCtn: {
                    duration: 0.5,
                    values: {
                        delay: 0,
                        y: 0,
                        scaleX: 0,
                        opacity: 0,
                        force3D: !0,
                        ease: Quad.easeInOut
                    }
                },
                timeline: {
                    duration: 0.5,
                    values: {
                        delay: 0,
                        x: '100%',
                        force3D: !0,
                        ease: Quad.easeInOut
                    }
                },
                videoThree: {
                    start:0,
                    end:8
                }        
            },
            trValues[12] = {
                stripe: {
                    duration: 0.5,
                    values: {
                        delay: 0.2,
                        y:0,
                        rotationZ: 0,
                        force3D: !0,
                        ease: Sine.easeIn,
                        backgroundColor:'#7543db'
                    }
                },
                dayScreens: {
                    duration: 0,
                    values: {
                        y:'-350%',
                    },
                },
                wideContent: {
                    duration: 0.8,
                    values: {
                        delay: 0.9,
                        y:'-350%',
                        rotationZ: 0,
                        force3D: !0,
                        ease: Quad.easeInOut
                    }
                },
                sliderTitles: {
                    duration: 0.5,
                    values: {
                        color:'#7543db'
                    },
                    title:'post-event',
                    number:'04',
                    verticalOne:'POST',
                    verticalTwo:'EVENT',
                    first:'The event still fresh on people’s minds,',
                    last:'A great time to reinforce the brand & establish loyalty between fan & event.'
                },
                iPhone: {
                    duration: 0.7,
                    values: {
                        delay: 0,
                        y: '-40%',
                        x: '-50%',
                        rotationZ: 0,
                        force3D: !0,
                        ease: Sine.easeIn
                    }
                },
                largeScreen: {
                    duration: 0.8,
                    values: {
                        delay: 0.9,
                        y: '-350%',
                        force3D: !0,
                        ease: Quad.easeInOut
                    }
                },
                article: {
                    delay: {
                        forward: 0,
                        backward: 0
                    }
                },
                timelineCtn: {
                    duration: 0.5,
                    values: {
                        delay: 0,
                        y: 0,
                        scaleX: 0,
                        opacity: 0,
                        force3D: !0,
                        ease: Quad.easeInOut
                    }
                },
                timeline: {
                    duration: 0.5,
                    values: {
                        delay: 0,
                        x: '100%',
                        force3D: !0,
                        ease: Quad.easeInOut
                    }
                },
                imageAnimate: {
                    img: '4',
                    duration: 0.5,
                    values: {
                        delay: 0,

                    }
                }
            },
            trValues[13] = {
                stripe: {
                    duration: 0.5,
                    values: {
                        delay: 0.2,
                        y:0,
                        rotationZ: 0,
                        force3D: !0,
                        ease: Sine.easeIn,
                        backgroundColor:'#7543db'
                    }
                },
                dayScreens: {
                    duration: 0,
                    values: {
                        y:'-350%',
                    },
                },
                wideContent: {
                    duration: 0.8,
                    values: {
                        delay: 0.9,
                        y:'-350%',
                        rotationZ: 0,
                        force3D: !0,
                        ease: Quad.easeInOut
                    }
                },
                sliderTitles: {
                    duration: 0.5,
                    values: {
                        color:'#7543db'
                    },
                    title:'post-event',
                    number:'04',
                    verticalOne:'POST',
                    verticalTwo:'EVENT',
                    first:'The event still fresh on people’s minds,',
                    last:'A great time to reinforce the brand & establish loyalty between fan & event.'
                },
                iPhone: {
                    duration: 0.7,
                    values: {
                        delay: 0,
                        y: '-40%',
                        x: '-50%',
                        rotationZ: 0,
                        force3D: !0,
                        ease: Sine.easeIn
                    }
                },
                largeScreen: {
                    duration: 0.8,
                    values: {
                        delay: 0.9,
                        y: '-350%',
                        force3D: !0,
                        ease: Quad.easeInOut
                    }
                },
                article: {
                    delay: {
                        forward: 0,
                        backward: 0
                    }
                },
                timelineCtn: {
                    duration: 0.5,
                    values: {
                        delay: 0,
                        y: 0,
                        scaleX: 0,
                        opacity: 0,
                        force3D: !0,
                        ease: Quad.easeInOut
                    }
                },
                timeline: {
                    duration: 0.5,
                    values: {
                        delay: 0,
                        x: '100%',
                        force3D: !0,
                        ease: Quad.easeInOut
                    }
                },
                imageAnimate: {
                    img: '5',
                    duration: 0.5,
                    values: {
                        delay: 0,

                    }
                }
            },
            trValues[14] = {
                stripe: {
                    duration: 0.5,
                    values: {
                        delay: 0.2,
                        y:0,
                        rotationZ: 0,
                        force3D: !0,
                        ease: Sine.easeIn,
                        backgroundColor:'#7543db'
                    }
                },
                dayScreens: {
                    duration: 0,
                    values: {
                        y:'-350%',
                    },
                },
                wideContent: {
                    duration: 0.8,
                    values: {
                        delay: 0.9,
                        y:'-350%',
                        rotationZ: 0,
                        force3D: !0,
                        ease: Quad.easeInOut
                    }
                },
                sliderTitles: {
                    duration: 0.5,
                    values: {
                        color:'#7543db'
                    },
                    title:'post-event',
                    number:'04',
                    verticalOne:'POST',
                    verticalTwo:'EVENT',
                    first:'The event still fresh on people’s minds,',
                    last:'A great time to reinforce the brand & establish loyalty between fan & event.'
                },
                iPhone: {
                    duration: 0.7,
                    values: {
                        delay: 0,
                        y: '-40%',
                        x: '-50%',
                        rotationZ: 0,
                        force3D: !0,
                        ease: Sine.easeIn
                    }
                },
                largeScreen: {
                    duration: 0.8,
                    values: {
                        delay: 0.9,
                        y: '-350%',
                        force3D: !0,
                        ease: Quad.easeInOut
                    }
                },
                article: {
                    delay: {
                        forward: 0,
                        backward: 0
                    }
                },
                timelineCtn: {
                    duration: 0.5,
                    values: {
                        delay: 0,
                        y: 0,
                        scaleX: 0,
                        opacity: 0,
                        force3D: !0,
                        ease: Quad.easeInOut
                    }
                },
                timeline: {
                    duration: 0.5,
                    values: {
                        delay: 0,
                        x: '100%',
                        force3D: !0,
                        ease: Quad.easeInOut
                    }
                },
                imageAnimate: {
                    img: '6',
                    duration: 0.5,
                    values: {
                        delay: 0,

                    }
                }
            };

        },
        initSlider: function() {
            /* jshint expr: true */

            $('#sections-list section .fifty').removeClass('top-pad-s'),
            $('#sections-list section').eq(0).addClass('current'), 
            $('#slider-nav li').eq(0).addClass('current'), 
            this.slider = $('.swiper-container').swiper({
                direction: 'horizontal',
                speed: 700,
                autoResize: !0,
                resistanceRatio: 0.7,
                longSwipesRatio: 0,
                spaceBetween: 0,
                onInit: function(e) {
                    lastSwipeProgress = e.progress;
                },
                onTransitionStart: function(e) {
                    $body.removeClass('slide-change');
                },
                onProgress: function(e, t) {
                    //console.log(e,t);
                    App.rotateSlide(e, t), 
                    $body.addClass('slide-change');
                },
                onSlideChangeEnd: function(e) {
                    var getActiveIndex = $('.swiper-slide-active').index();
                    $body.attr('data-current-section',getActiveIndex);
                    lastSwipeProgress = e.progress,
                    $('#sections-list section').removeClass('current').eq(e.activeIndex).addClass('current'), 
                    $('#slider-nav li').removeClass('current').eq(e.activeIndex).addClass('current');
                    var bData = $body.attr('data-current-section'),
                        titles = $('#titles');
                    if(bData >= 0 && bData <= 4) {
                        titles.removeClass();
                        titles.addClass('blue');
                        titles.find('h3 span').text('01');
                    }
                    if(bData >= 5 && bData <= 9) {
                        titles.removeClass();
                        titles.addClass('orange');
                        titles.find('h3 span').text('02');
                    }
                    if(bData >= 10 && bData <= 10) {
                        //console.log(bData);
                        titles.removeClass();
                        titles.addClass('green');
                        titles.find('h3 span').text('03');
                    }
                    if(bData >= 11 && bData <= 14) {
                        titles.removeClass();
                        titles.addClass('purple');
                        titles.find('h3 span').text('04');
                    }
                }
            }), 
            slidesNumber = $('.swiper-slide').length, 
            $(document).on('click touchend', '#slider-nav a', function(e) {
                e.preventDefault();
            });
        },
        rotateSlide: function(e, t) {
                        /* jshint expr: true */

            //console.log('rotate motherf', e, t);
            var i, n = lastSwipeProgress - t,
                r = n * (slidesNumber - 1),
                s = $('#slider-images span').eq(e.activeIndex),
                a = $('#slider-images span').eq(0 > n ? e.activeIndex + 1 : e.activeIndex - 1),
                o = Math.min(90, 90 * r);
            r >= 0 ? i = Math.max(-90, -90 + 90 * r) : 0 > r && (i = Math.min(90, 90 - -90 * r)),
            //console.log('lastSwipeProgress',lastSwipeProgress,'slidesNumber: ',slidesNumber, 'n: ',n,'e: ',e,'i: ',i,'a: ',a,'o: ',o,'s: ',s,'t: ',t),
            o = Math.round(o * 100) / 100,
            i = Math.round(i * 100) / 100,
            console.log('O: ',o,'I: ',i),
            s.css({
                transform: 'rotate(' + o + 'deg)'
            }), 
            a.css({
                transform: 'rotate(' + i + 'deg)'
            }), 
            lastViableProgress = t;
        },
        initiPadVideo: function() {
            video.play(), 
            video.pause(), 
            console.log('iPad video initiated.'), 
            $(document).off('touchend', App.initiPadVideo);
        }


	};

    var playVideoTwo = function() {
        console.log(videoTwo),
        playVideoTwo = function(){},//kill function to call just once.
        videoTwo.play(); 
    };

    function TabletScroll() {
        /* jshint expr: true */

        this.init = function() {
            console.log('TabletScroll');
            touchmoveDisabled = !0, 
            $(document).on('touchend', App.initiPadVideo), 
            $(document).swipe({
                threshold: 100,
                allowPageScroll: 'none',
                swipeUp: function() {
                    console.log('swipeUp'),
                    !transitioning && currentSection < sections.length - 1 && (transitioning = !0, 
                    currentSection++, 
                    forward = !0, 
                    sections[currentSection].animate(forward));
                },
                swipeDown: function() {
                    console.log('swipeDown'),
                    !transitioning && currentSection > 0 && (transitioning = !0, 
                    currentSection--, 
                    forward = !1, 
                    sections[currentSection].animate(forward));
                }
            });
        }, 
        this.kill = function() {
            touchmoveDisabled = !1, 
            $(document).swipe('destroy');
        };
    }



})(jQuery, window, document);

