var order_pizza = {};
var order_pasta = {};

function getPizzaOrder() {

    var ingredients = {};
    var price = 0;
    var count = 0;

    //Get pizza order
    order_pizza.name = document.getElementById('name').value;
    order_pizza.lastname = document.getElementById('lastname').value;
    order_pizza.phone = document.getElementById('phone').value;
    order_pizza.date = document.getElementById('date').value;

    if (order_pizza.name != '' && order_pizza.lastname != '' && order_pizza.phone != '') {
        //Check the pizza type
        if (document.getElementById('rounded').checked) {
            order_pizza.type = 'rounded';
        }
        if (document.getElementById('squared').checked) {
            order_pizza.type = 'squared';
        }

        //Get pizza size small = 8.50, medium = 10.50, large = 12.50, x-large = 15.50
        order_pizza.size = document.getElementById('size').value;

        if (order_pizza.size == 'small') {
            price = 8.50;
        } else if (order_pizza.size == 'medium') {
            price = 10.50;
        } else if (order_pizza.size == 'large') {
            price = 12.50;
        } else if (order_pizza.size == 'x-large') {
            price = 15.50;
        }

        //Ingredients (onion, ham, pepperoni, bacon, grilled-chicken, hamburger). 
        //2 first ingredients are free. More than 2 ingredients increases total price in 0.75 for each ingredient
        if (document.getElementById('onion').checked) {
            ingredients.onion = 'onion';
            count++;
        }
        if (document.getElementById('ham').checked) {
            ingredients.ham = 'ham';
            count++;
        }
        if (document.getElementById('pepperoni').checked) {
            ingredients.pepperoni = 'pepperoni';
            count++;
        }
        if (document.getElementById('bacon').checked) {
            ingredients.bacon = 'bacon';
            count++;
        }
        if (document.getElementById('grilled_chicken').checked) {
            ingredients.grilled_chicken = 'grilled_chicken';
            count++;
        }
        if (document.getElementById('hamburger').checked) {
            ingredients.hamburger = 'hamburger';
            count++;
        }
        order_pizza.ingredients = ingredients;

        if (count > 2) {
            price = price + (count - 2) * 0.75;
        }

        order_pizza.price = price;
        
        clearFileds();
        message('Pizza');
    }
    else {
        swal('Warning','Please, fill all the required fields','warning');
    }
    
}

function getPastaOrder() {
    //Get pasta order
    order_pasta.name = document.getElementById('name').value;
    order_pasta.lastname = document.getElementById('lastname').value;
    order_pasta.phone = document.getElementById('phone').value;
    order_pasta.date = document.getElementById('date').value;

    if (order_pasta.name != '' && order_pasta.lastname != '' && order_pasta.phone != '') {

        order_pasta.style = document.getElementById('style').value;

        if (order_pasta.style == 'tomato-sauce') {
            price = 10.45;
        } else if (order_pasta.style == 'garlic-oil') {
            price = 10.45;
        } else if (order_pasta.style == 'mushroom') {
            price = 11.75;
        } else if (order_pasta.style == 'f-alfredo') {
            price = 13.95;
        }
        else if (order_pasta.style == 'f-primavera') {
            price = 13.05;
        }
        else if (order_pasta.style == 'lasagna') {
            price = 11.95;
        } else if (order_pasta.style == 'ravioli') {
            price = 10.99;
        } else if (order_pasta.style == 'baked-ziti') {
            price = 12.00;
        }
        order_pasta.price = price;
        clearFileds();
        message('Pasta');
    }
    else {
        swal('Warning', 'Please, fill all the required fields', 'warning');
    }
}

function clearFileds() {
    document.getElementById('name').value = '';
    document.getElementById('lastname').value = '';
    document.getElementById('phone').value = '';
}

function message(order) {
    swal({
        title: "Your order is complete. Continue?",
        text: "Once your order is placed, you you are not able to cancel it!",
        type: "warning",
        showCancelButton: true,
        confirmButtonClass: "btn-danger",
        confirmButtonText: "Yes, place it!",
        cancelButtonText: "No, cancel order!",
        closeOnConfirm: false,
        closeOnCancel: false
    },
        function (isConfirm) {
            if (isConfirm) {
                //Save pizza order on local storage
                if (order == 'Pizza')
                    saveorder(order, order_pizza);
                //Save pasta order on local storage
                else if (order == 'Pasta')
                    saveorder(order, order_pasta);
                swal("Great!", "Your order was successfully placed!", "success");
            } else {
                swal("Cancelled", "Your order was cancelled!", "error");
            }
        });
}

let saveorder = (ordertype, orderdata) => {
    let form = {
        ordertype: ordertype,
        details: JSON.stringify(orderdata),
    }
    $.ajax({
        url: '/saveorder',
        type: 'POST',
        data: form,
        // success: (data, status) => {
        //     if (status === 'success') {
        //         alert('Order saved');
        //     }
        // }
    })
}

let deleteOrder = (id) => {
    $.ajax({
        url: `/deleteorder?id=${id}`,
        type: 'GET',
        success: (data, status) => {
            if (status === 'success'){
                getOrders();
                alert('order deleted');
            }
        }
    })
}

let getOrders = () => {
    $.ajax({
        url: '/getorders',
        type: 'GET',
        success: (data, status) => {
            if (status === 'success'){
                listOrders(JSON.parse(data));
            }
        }
    })
}

let editPizzaOrder = (order) => {
    var orderData = JSON.parse(order.details);
    $('#name').val(orderData.name);
    $('#lastname').val(orderData.lastname);
    $('#phone').val(orderData.phone);
    $('#date').val(orderData.date);
    $('#size').val(orderData.size);
    if (orderData.type === 'rounded')
        $('#rounded').attr('checked', true);
    if (orderData.type === 'squared')
        $('#squared').attr('checked', true);
    if ('ham' in orderData.ingredients)
        $('#ham').attr('checked', true)
    else $('#ham').attr('checked', false);
    if ('bacon' in orderData.ingredients)
        $('#bacon').attr('checked', true)
    else $('#bacon').attr('checked', false);
    if ('hamburger' in orderData.ingredients)
        $('#hamburger').attr('checked', true)
    else $('#hamburger').attr('checked', false);
    if ('pepperoni' in orderData.ingredients)
        $('#pepperoni').attr('checked', true)
    else $('#pepperoni').attr('checked', false);
    if ('grilled_chicken' in orderData.ingredients)
        $('#grilled_chicken').attr('checked', true)
    else $('#grilled_chicken').attr('checked', false);
    if ('onion' in orderData.ingredients)
        $('#onion').attr('checked', true)
    else $('#onion').attr('checked', false);
    $('#edit-pizza').modal('show');
}

let editPastaOrder = (order) => {
    var orderData = JSON.parse(order.details);
    $('#name').val(orderData.name);
    $('#lastname').val(orderData.lastname);
    $('#phone').val(orderData.phone);
    $('#date').val(orderData.date);
    $('#style').val(orderData.style);
    $('#edit-pasta').modal('show');
}

let updatePizza = () => {
    getPizzaOrder();
}

let listOrders = (data) => {
    if (data.length > 0) {
        var listPizza = '';
        var listPasta = '';
        data.forEach(order => {
            var ingredientsList = '';
            var orderData = JSON.parse(order.details);
            if (order.ordertype === 'Pizza') {
                for (var i in orderData.ingredients) {
                    ingredientsList += ', ' + orderData.ingredients[i];
                }
                listPizza += `<tr>
                    <td>${order.orderid}</td>
                    <td>${order.ordertype}</td>
                    <td>${orderData.date}</td>
                    <td>
                        <p style="margin:0">${orderData.name} ${orderData.lastname}</p>
                        <p style="margin:0">${orderData.phone}</p>
                    </td>
                    <td>${orderData.size}/${orderData.type}</td>
                    <td style="margin:0">${ingredientsList.replace(',', '')}</td>
                    <td>${orderData.price}</td>
                    <td style="width:15%">
                        <button class="btn btn-link" style="padding-top:0; padding-left:0; padding-right:0" onclick=\'editPizzaOrder(${JSON.stringify(order)})\'>
                            <i class="fa fa-edit" style="font-size:24px;color:darkgreen"></i>
                        </button>
                    <button class="btn btn-link" style="padding-top:0" onclick="deleteOrder(${order.orderid})">
                        <i class="fa fa-trash-o" style="font-size:24px;color:red"></i>
                    </button>
                    </td>
                </tr>`;
                $('#pizza-orders-list').html(listPizza);
        }
            else if (order.ordertype === 'Pasta') {
                listPasta += `<tr>
                    <td>${order.orderid}</td>
                    <td>${order.ordertype}</td>
                    <td>${orderData.date}</td>
                    <td>
                        <p style="margin:0">${orderData.name} ${orderData.lastname}</p>
                        <p style="margin:0">${orderData.phone}</p>
                    </td>
                    <td>${orderData.style}</td>
                    <td>${orderData.price}</td>
                    <td style="width:15%">
                        <button class="btn btn-link" style="padding-top:0; padding-left:0; padding-right:0" onclick=\'editPastaOrder(${JSON.stringify(order)})\'>
                            <i class="fa fa-edit" style="font-size:24px;color:darkgreen"></i>
                        </button>
                    <button class="btn btn-link" style="padding-top:0" onclick="deleteOrder(${order.orderid})">
                        <i class="fa fa-trash-o" style="font-size:24px;color:red"></i>
                    </button>
                    </td>
                </tr>`;
                $('#pasta-orders-list').html(listPasta);
            }
        });
    }
}