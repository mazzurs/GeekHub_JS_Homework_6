;(function () {
    var body = $(document.body);
    var countRow = 1;
    var count = 1;
    var childrenCount = 0;
    var first = true;


    $('#products > * [data-grabbing]').on('mousedown', function (event) {
        var helper = $(event.currentTarget);
        var clone = $(event.currentTarget).clone();
        clone.css('width', helper.width());
        clone.appendTo(document.body);

        var helperOffset = helper.offset();
        var offset = {
            top: event.pageY - helperOffset.top,
            left: event.pageX - helperOffset.left
        };

        var product = helper.closest('[data-product]');
        product.addClass('dragging');
        clone.css({
            top: event.pageY - offset.top,
            left: event.pageX - offset.left
        });

        var carts = $('[data-cart]').toArray().map(function (cart) {
            var rect = cart.getBoundingClientRect();
            return {
                node: $(cart),
                rect: rect
            }
        });

        var prevCart;

        body.on('mousemove', function (event) {
            clone.css({
                top: event.pageY - offset.top,
                left: event.pageX - offset.left,
            });


            var cloneRect = clone.get(0).getBoundingClientRect();

            var cart = carts.find(function (cart) {
                return overLaps(cart.rect, cloneRect)
            });

            if (cart) {
                $('[data-cart]').addClass('overLaps');
            }
            else {
                $('[data-cart]').removeClass('overLaps');
            }
            prevCart = cart;
        });

        body.on('mouseup', function (event) {
            var temp = false;
            var countHelper = null;


            if (prevCart) {
                var tbody = $('[data-cart]');

                for (i = 0; i < tbody[0].children.length - 1; i++) {
                    if (tbody[0].children[i + 1].children[1].innerText == product[0].children[1].innerText) {
                        temp = true;
                        countHelper = i + 1;
                        break;
                    }
                    //      tbody[0].children[i+1].children[3].textContent =+(tbody[0].children[i+1].children[3].textContent)+1;
                }
                if (temp) {
                    tbody[0].children[countHelper].children[3].childNodes[0].nodeValue = +(tbody[0].children[i + 1].children[3].childNodes[0].nodeValue) + 1;
                    clone.remove();
                    product.removeClass('dragging');
                    var temp = false;
                    var countHelper = null;
                }
                else {
                    var name = product[0].children[1].outerText;
                    var priceHelper = product[0].children[2].outerText;
                    var price = /\d+/.exec(priceHelper);
                    var newEl = document.createElement("tr");
                    newEl.classList.add('table-header');
                    newEl.innerHTML = "<td class=\"table-columns\">" + countRow + "</td><td class=\"table-columns\">" + name + "</td><td class=\"table-columns\">" + price + " руб." + "</td><td class=\"table-columns\">" + count + "<input data-delete type=\"button\" class=\"delete\" value=\"Del\"></td>";
                    tbody[0].appendChild(newEl);
                    clone.remove();
                    product.removeClass('dragging');
                    countRow++;

                    var helperCount = $('tr').length-1;
                    for(i=0; i<helperCount; i++){
                        tbody[0].children[i+1].children[0].innerText = i+1;
                    }


                    $('input[class="delete"]').on('mouseup', function (event) {

                        var helperCount = $('tr').length-1;
                        for(i=0; i<helperCount; i++){
                            tbody[0].children[i+1].children[0].innerText = i+1;
                        }

                        event.currentTarget.closest('tr').remove();

                        var countProduct = 0;
                        var stringToNumber;
                        for (i = 1; i < tbody[0].children.length; i++) {
                            stringToNumber = +tbody[0].children[i].children[3].childNodes[0].nodeValue;
                            countProduct += stringToNumber;
                        }
                        var exportCountProduct = $('[data-count]');
                        exportCountProduct[0].textContent = "Общее количество товаров: " + countProduct;

                    });



                }
                var countProduct = 0;
                var stringToNumber;
                for (i = 1; i < tbody[0].children.length; i++) {
                    stringToNumber = +tbody[0].children[i].children[3].childNodes[0].nodeValue;
                    countProduct += stringToNumber;
                }
                var exportCountProduct = $('[data-count]');
                exportCountProduct[0].textContent = "Общее количество товаров: " + countProduct;
            }

            clone.remove();
            product.removeClass('dragging');
        });

    });

    function overLaps(rect1, rect2) {
        return !(rect1.right < rect2.left ||
            rect1.left > rect2.right ||
            rect1.bottom < rect2.top ||
            rect1.top > rect2.bottom);
    }

})();








