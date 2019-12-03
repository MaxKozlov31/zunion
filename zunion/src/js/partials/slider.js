/* Slider */
$('#mob_app').slick({
    //infinite: true, //беск прокр
    slidesToShow: 4,
    slidesToScroll: 1,
    arrows: false,


    // fade: true,
    // arrows: true,
    // variableWidth: true,
    // centerMode: true,
    // responsive: [
    //     {
    //         breakpoint: 767,
    //         settings: {
    //             slidesToShow: 1,
    //             slidesToScroll: 1,
    //             infinite: true,
    //             centerMode: true,
    //         }
    //     }
    // ]
});
$(".slickPrev").on("click", function(event) {
    event.preventDefault();

    $('#mob_app').slick("slickPrev");
});

$(".slickNext").on("click", function(event) {
    event.preventDefault();

    $('#mob_app').slick("slickNext");
});





$('#agregator').slick({
    //infinite: true, //беск прокр
    slidesToShow: 2,
    slidesToScroll: 1,
    arrows: false,
});

$(".AgrslickPrev").on("click", function(event) {
    event.preventDefault();

    $('#agregator').slick("slickPrev");
});

$(".AgrslickNext").on("click", function(event) {
    event.preventDefault();

    $('#agregator').slick("slickNext");
});

///////////////////////

$('#agregator2').slick({
    //infinite: true, //беск прокр
    slidesToShow: 2,
    slidesToScroll: 1,
    arrows: false,
});

$(".Agr2slickPrev").on("click", function(event) {
    event.preventDefault();

    $('#agregator2').slick("slickPrev");
});

$(".Agr2slickNext").on("click", function(event) {
    event.preventDefault();

    $('#agregator2').slick("slickNext");
});

///////////////////////

$('#agregator3').slick({
    //infinite: true, //беск прокр
    slidesToShow: 2,
    slidesToScroll: 1,
    arrows: false,
});

$(".Agr3slickPrev").on("click", function(event) {
    event.preventDefault();

    $('#agregator3').slick("slickPrev");
});

$(".Agr3slickNext").on("click", function(event) {
    event.preventDefault();

    $('#agregator3').slick("slickNext");
});

///////////////////////

$('.intro_cases_slider_block').slick({

    infinite: true, //беск прокр
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    dots: true,

});

/////////////////////////////


$('#partners').slick({
    //infinite: true, //беск прокр
    slidesToShow: 5,
    slidesToScroll: 1,
    arrows: false,
});
