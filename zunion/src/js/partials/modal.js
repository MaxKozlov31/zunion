const modalCall = $("[data-modal]");
const modalClose = $("[data-close]");

modalCall.on("click", function(event) {
    event.preventDefault();

    let $this = $(this);
    let modalId = $this.data('modal');

    $(modalId).addClass('show');
    $("body").addClass('no-scroll')

    setTimeout(function() {
        $(modalId).find(".modal_dialog").css({
            transform: "scale(1)"
        });
    }, 200);

    

});


modalClose.on("click", function(event) {
    event.preventDefault();

    let $this = $(this);
    let modalParent = $this.parents('.modal');

    modalParent.find(".modal_dialog").css({
        transform: "scale(0)"
    });

    setTimeout(function() {
        modalParent.removeClass('show');
        $("body").removeClass('no-scroll');
    }, 200);

    

});

$(".modal").on("click", function(event) {
    let $this = $(this);

    $this.find(".modal_dialog").css({
        transform: "scale(0)"
    });

    setTimeout(function() {
        $this.removeClass('show');
        $("body").removeClass('no-scroll');
    }, 200);
 
});

$(".modal_dialog").on("click", function(event) {
    event.stopPropagation();
});