  var slide = new Array (
    "ADG2008_files/Shanghai1.jpg",
    "ADG2008_files/Shanghai2.jpg",
    "ADG2008_files/Shanghai3.jpg",
    "ADG2008_files/Shanghai4.jpg",
    "ADG2008_files/Shanghai5.jpg",
    "ADG2008_files/Shanghai6.jpg",
    "ADG2008_files/Shanghai7.jpg",
    "ADG2008_files/Shanghai8.jpg",
    "ADG2008_files/Shanghai9.jpg",
    "ADG2008_files/Shanghai10.jpg",
    "ADG2008_files/Shanghai11.jpg",
    "ADG2008_files/Shanghai12.jpg"
  )
      
  var descr = new Array (
    "Shanghai1",
    "Shanghai2",
    "Shanghai3",
    "Shanghai4",
    "Shanghai5",
    "Shanghai6",
    "Shanghai7",
    "Shanghai8",
    "Shanghai9",
    "Shanghai10",
    "Shanghai11",
    "Shanghai12"
  )

  var filter = new Array (
    "progid:DXImageTransform.Microsoft.Pixelate(MaxSquare=10)",
    "progid:DXImageTransform.Microsoft.RandomBars()",
    "progid:DXImageTransform.Microsoft.Iris(irisstyle=CIRCLE,motion=in)",
    "progid:DXImageTransform.Microsoft.Barn(motion=in,orientation=horizontal)",
    "progid:DXImageTransform.Microsoft.Iris(irisstyle=CIRCLE,motion=out)",
    "progid:DXImageTransform.Microsoft.RadialWipe(wipestyle=CLOCK)",
    "progid:DXImageTransform.Microsoft.Barn(motion=in,orientation=vertical)",
    "progid:DXImageTransform.Microsoft.Stretch(stretchstyle=SPIN)",
    "progid:DXImageTransform.Microsoft.RandomDissolve()",
    "progid:DXImageTransform.Microsoft.Strips(motion=leftdown)",
    "progid:DXImageTransform.Microsoft.Spiral(GridSizeX=16,GridSizeY=16)",
    "progid:DXImageTransform.Microsoft.Stretch(stretchstyle=SPIN)"
  )

  var n = slide.length;
  var i = 0;
  
  function slide_loop() {
    if (typeof document.images.SLIDE.filters != 'undefined') {  
      document.images.SLIDE.style.filter = filter[i];
      document.images.SLIDE.filters[0].Apply();
    }

    document.images.SLIDE.src = slide[i];
    document.images.SLIDE.alt = descr[i];

    if (typeof document.images.SLIDE.filters != 'undefined') 	
      document.images.SLIDE.filters[0].Play();

    if (i < n - 1) i++; else i = 0;
    setTimeout( "slide_loop()", 3000);
  }

  function slide_show() {
    i = Math.floor(Math.random()*(n-1)+0.2); 
    slide_loop();
  }
