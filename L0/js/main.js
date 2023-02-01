document.addEventListener("DOMContentLoaded", () => {

  const listItemsAvailable = document.querySelector('.section-cart-accordion-list-available');
  const listItemsEnded = document.querySelector('.section-cart-accordion-list-ended');
  const blockForPrice = document.querySelector('.section-total-top');
  const blocksDeliveryPhotos = document.querySelectorAll('.section-delivery-middle__photo-descr');


  const itemsAvailable = listItemsAvailable.querySelectorAll('.section-cart-accordion-list__item-remain');
  let goodsPrices = [];

  for (let i = 0; i<itemsAvailable.length; i++){
    let itemAmount = parseInt(itemsAvailable[i].querySelector('.section-cart-accordion-list__item-count').innerHTML);
    let itemTotalPrice = parseInt(itemsAvailable[i].querySelector('.section-cart-accordion-list__item-real-price-number').innerHTML.split(' ').join(''));
    let itemPreviosTotalPrice = parseInt(itemsAvailable[i].querySelector('.section-cart-accordion-list__item-price-tooltip-text').innerHTML.split(' ').join(''));

    let itemPrice = parseFloat((itemTotalPrice/itemAmount).toFixed(3));
    let itemPreviosPrice = parseFloat((itemPreviosTotalPrice/itemAmount).toFixed(3));
    let itemDiscount = itemPreviosPrice - itemPrice;

    goodsPrices.push({'itemPrice': itemPrice, 'itemPreviosPrice': itemPreviosPrice, 'itemDiscount': itemDiscount})
  }

  const accordionHeaders = document.querySelectorAll('.section-cart-accordion__header');

  accordionHeaders.forEach(function(accordionHeader){
    accordionHeader.addEventListener('click', function (){
      accordionHeader.parentNode.querySelector('.section-cart-accordion-list').classList.toggle('passive');
      accordionHeader.querySelector('.section-cart-accordion__icon').classList.toggle('section-cart-accordion__icon-rotate');
      if(accordionHeader.querySelector('.section-cart-accordion-checkbox')){
        accordionHeader.querySelector('.section-cart-accordion-checkbox').classList.toggle('passive');
        accordionHeader.querySelector('.section-cart-accordion__header-text').classList.toggle('passive');

        let totalSumm = 0;
        let totalAmount = 0;

        /*listItemsAvailable.querySelectorAll('.section-cart-accordion-list__item-remain').forEach(function(el){
          let itemAmount = parseInt(el.querySelector('.section-cart-accordion-list__item-count').innerHTML);
          let itemPrice = parseInt(el.querySelector('.section-cart-accordion-list__item-real-price-number').innerHTML.split(' ').join(''));

          totalAmount += itemAmount;
          totalSumm += itemAmount*itemPrice;

        });*/

        for (let i = 0; i<itemsAvailable.length; i++){
          if (itemsAvailable[i].classList.contains('section-cart-accordion-list__item-remain')) {
            const itemAmount = parseInt(itemsAvailable[i].querySelector('.section-cart-accordion-list__item-count').innerHTML);
            const itemPrice = goodsPrices[i].itemPrice;
            console.log(itemPrice)
            totalAmount += itemAmount;
            totalSumm += itemAmount*itemPrice;
            console.log(totalSumm)
          }
        }
        
        if (totalAmount%10===1 && totalAmount!==11){
          accordionHeader.querySelector('.section-cart-accordion__header-text').innerHTML = `${totalAmount}`+' '+'товар'+' · '+makeStrfromNumber(parseFloat((totalSumm).toFixed(3))) + ' ' + 'сом';
        } else if ((totalAmount%10===2 || totalAmount%10===3 || totalAmount%10==4) && (totalAmount!==12 || totalAmount!==13 || totalAmount!==14)){
          accordionHeader.querySelector('.section-cart-accordion__header-text').innerHTML = `${totalAmount}`+' '+'товара'+' · '+makeStrfromNumber(parseFloat((totalSumm).toFixed(3))) + ' ' + 'сом';
        } else{
          accordionHeader.querySelector('.section-cart-accordion__header-text').innerHTML = `${totalAmount}`+' '+'товаров'+' · '+makeStrfromNumber(parseFloat((totalSumm).toFixed(3))) + ' ' + 'сом';
        };
      };
    });
  });


  const btnsMinus = document.querySelectorAll('.section-cart-accordion-list__item-minus');
  const btnsPlus = document.querySelectorAll('.section-cart-accordion-list__item-plus');

  btnsMinus.forEach(function(btnMinus){
    btnMinus.addEventListener('click', function (){
      let count = parseInt(btnMinus.parentNode.querySelector('.section-cart-accordion-list__item-count').innerHTML);
      let btnPlus = btnMinus.parentNode.querySelector('.section-cart-accordion-list__item-plus');
      if (count > 1){
        let newCount = count - 1;
        if (newCount === 1){
          btnMinus.classList.remove('btn-active');
        }
        btnMinus.parentNode.querySelector('.section-cart-accordion-list__item-count').innerHTML = `${newCount}`; 
        btnPlus.classList.add('btn-active');
      } else{
        btnMinus.parentNode.querySelector('.section-cart-accordion-list__item-count').innerHTML = '1';
        btnMinus.classList.remove('btn-active');
      }
      calculateTotalPrice();
    });
  });

  btnsPlus.forEach(function(btnPlus){
    btnPlus.addEventListener('click', function (){
      let count = parseInt(btnPlus.parentNode.querySelector('.section-cart-accordion-list__item-count').innerHTML);
      let btnMinus = btnPlus.parentNode.querySelector('.section-cart-accordion-list__item-minus');
      let newCount = count + 1;
      if (btnPlus.parentNode.parentNode.querySelector('.section-cart-accordion-list__item-available')) {
        let str = btnPlus.parentNode.parentNode.querySelector('.section-cart-accordion-list__item-available').innerHTML;
        for (let el of str.trim().split(' ')){
          if (!isNaN(parseInt(el)) && count===el-1){
            btnPlus.classList.remove('btn-active');
            btnPlus.parentNode.querySelector('.section-cart-accordion-list__item-count').innerHTML = `${newCount}`;
            btnMinus.classList.add('btn-active');
          } else if (!isNaN(parseInt(el)) && count<el-1)  {
            btnPlus.parentNode.querySelector('.section-cart-accordion-list__item-count').innerHTML = `${newCount}`;
            btnMinus.classList.add('btn-active');
          };
        };
      } else{
        btnPlus.parentNode.querySelector('.section-cart-accordion-list__item-count').innerHTML = `${newCount}`;
        btnMinus.classList.add('btn-active');
      }; 
      calculateTotalPrice();
    });
  });

  
  const checkAll = document.getElementById('check-all');
  const checkboxes = document.querySelectorAll('.section-cart-accordion-list__item-input');
  const totalAmountCheckbox = checkboxes.length;

  checkAll.addEventListener('click', function(){
    if (this.checked) {
      checkboxes.forEach(function(el){
        el.checked = true;
      });
      calculateTotalPrice();
    };
  });

  checkboxes.forEach(function(el){
    el.addEventListener('click', () => {
      let uncheckAmount = 0;
      for(let checkbox of checkboxes){
        if (!checkbox.checked){
          uncheckAmount++;
        };
      };
      if (totalAmountCheckbox === uncheckAmount){
        checkAll.checked = false;
      };
      calculateTotalPrice();
    });
  });

  document.querySelectorAll('.section-cart-accordion-list__item-act-btn').forEach((el)=>{
    el.addEventListener('click', ()=>{
      el.classList.toggle('section-cart-accordion-list__item-act-btn-active');
    }); 
  });

  
  const payNowCheck = document.getElementById('pay-now');
  const oderBtn = document.querySelector('.section-total-bottom__btn');
  const totalPrice = document.querySelector('.section-total-top__total-price');

  payNowCheck.addEventListener('click', () => {
    if (payNowCheck.checked){
      oderBtn.innerHTML = 'Оплатить' + ' ' + `${totalPrice.innerHTML}`;
    } else{
      oderBtn.innerHTML = 'Заказать';
    };
  });

  
  const nameInput = document.getElementById('name');
  const surnameInput = document.getElementById('surname');
  const emailInput = document.getElementById('email');
  const telInput = document.getElementById('tel');
  const indexInput = document.getElementById('index');
  const massInputs = [nameInput, surnameInput, emailInput, telInput, indexInput];

  if (window.screen.availWidth < 685){
    emailInput.parentNode.querySelector('.section-recipient-form__label').innerHTML = 'Электронная почта'
  }

  window.addEventListener('resize', () => {
    if (window.screen.availWidth < 685){
      emailInput.parentNode.querySelector('.section-recipient-form__label').innerHTML = 'Электронная почта'
    }
  });

  telInput.addEventListener('focus', function() {
    if(!this.value.trim()){
      this.value = '+';
    }
  });

  telInput.addEventListener('blur', function() {
    if(this.value.trim().length===1){
      this.value = '';
    }    
  });

  /*telInput.addEventListener('paste', function() {
    const mass = this.value.trim().split('');
    let str = '';
    for (let i in mass){
      if (i==='2' || i==='5' || i==='7'){
        str += ' ';
      }
      str += mass[i];
      console.log(str);
    }
    this.value = str;
  });*/

  telInput.addEventListener("keypress", function(){
    if (this.value.length===18){
      this.value=this.value+" ";
    } 
  });

  telInput.addEventListener("keypress", function(){
    if (this.value.length===2){
      this.value=this.value+" (";
    } 
  });

  telInput.addEventListener("keypress", function(){
    if (this.value.length===7){
      this.value=this.value+") ";
    } 
  });

  telInput.addEventListener("keypress", function(){
    if (this.value.length===12 || this.value.length===15){
      this.value=this.value+"-";
    } 
  });


  for(let i in massInputs){
    massInputs[i].addEventListener('blur', () => {
      if(massInputs[i].value){
        massInputs[i].parentNode.querySelector('.section-recipient-form__label').classList.add('section-recipient-form__label-top');
      } else{
        massInputs[i].parentNode.querySelector('.section-recipient-form__label').classList.remove('section-recipient-form__label-top');
      }
    });
  };


  oderBtn.addEventListener('click', () => {
    const name = nameInput.value.trim();
    const surname = surnameInput.value.trim();
    const email = emailInput.value.trim();
    const tel = telInput.value.trim();
    const index = indexInput.value.trim();

    let massErrors = [];

    massErrors.push(errorsInName(name));
    massErrors.push(errorsInSurname(surname));
    massErrors.push(errorsInEmail(email));
    massErrors.push(errorsInTel(tel));
    massErrors.push(errorsInIndex(index));    

    for (let i in massErrors){
      manageErrorElement(massErrors[i], i);
    };

    for (let i in massErrors){
      if(massErrors[i]){
        location.href = "#" + massInputs[i].id;
        break
      };
    };
  });


  for (let i in massInputs){
    massInputs[i].addEventListener('blur', function(){
      if(this.value.trim()){
        hangListenerOnInput(this.value.trim(), i);
      };
    }); 
    massInputs[i].addEventListener('keyup', function(){
      if(massInputs[i].parentNode.querySelector('.section-recipient-form__error')){
        hangListenerOnInput(this.value.trim(), i);
      };
    });
  };

  const deleteItemBtn = document.querySelectorAll('.section-cart-accordion-list__item-delete-btn');
  const cartBtnHeader = document.querySelector('.header-btns__cart-btn'); 
  const cartBtnFooter = document.querySelector('.footer-bottom-list__item-cart-btn');

  deleteItemBtn.forEach((el) => {
    el.addEventListener('click', (e) =>{
      const path = e.currentTarget.dataset.path;
      document.querySelector(`[data-target="${path}"]`).classList.add('passive');
      if(document.querySelector(`[data-target="${path}"]`).classList.contains('section-cart-accordion-list__item-remain')){
        document.querySelector(`[data-target="${path}"]`).classList.remove('section-cart-accordion-list__item-remain');
        let cartAmountItems = [];
        cartAmountItems.push(cartBtnHeader.querySelector('.cart-amount-items'));
        cartAmountItems.push(cartBtnFooter.querySelector('.cart-amount-items'));
        for (i in cartAmountItems){
          cartAmountItems[i].innerHTML = `${parseInt(cartAmountItems[i].innerHTML)-1}`;
          if (parseInt(cartAmountItems[i].innerHTML) === 0){
            cartAmountItems[i].classList.add('passive');
          };
        };
      } else if(document.querySelector(`[data-target="${path}"]`).classList.contains('section-cart-accordion-list__item-ended')){
        document.querySelector(`[data-target="${path}"]`).classList.remove('section-cart-accordion-list__item-ended');
        const count = listItemsEnded.querySelectorAll('.section-cart-accordion-list__item-ended').length;

        if (count%10===1 && count!==11){
          document.querySelector(`[data-target="${path}"]`).parentNode.previousElementSibling.querySelector('.section-cart-accordion__header-text').innerHTML = 'Отсутствует · '+`${count}`+' товар';
        } else if ((count%10===2 || count%10===3 || count%10==4) && (count!==12 || count!==13 || count!==14)){
          document.querySelector(`[data-target="${path}"]`).parentNode.previousElementSibling.querySelector('.section-cart-accordion__header-text').innerHTML = 'Отсутствуют · '+`${count}`+' товара';
        } else{
          document.querySelector(`[data-target="${path}"]`).parentNode.previousElementSibling.querySelector('.section-cart-accordion__header-text').innerHTML = 'Отсутствует · '+`${count}`+' товаров';
        };
      }
      
      


      

      calculateTotalPrice()
    });
  });

  const changeBtn = document.querySelectorAll('.change-btn');
  
  const modalProperties = {
    title: '',
    deliveryType: '',
    deliveryAdress: '',
    cardNumber: '',
    homeAdress: ['Бишкек, улица Табышалиева, 57', 
    'Бишкек, улица Жукеева-Пудовкина, 77/1', 
    'Бишкек, микрорайон Джал, улица Ахунбаева Исы, 67/1'],
    pointAdress: ['г. Бишкек, улица Ахматбека Суюмбаева, 12/1', 
    'г. Бишкек, микрорайон Джал, улица Ахунбаева Исы, д. 67/1', 
    'г. Бишкек, улица Табышалиева, д. 57'],
    allCardsName: ['mir', 'visa', 'mastercard', 'maestro'],
    allCardsNumber: ['1234 56•• •••• 1234', '1234 56•• •••• 1243', '1234 56•• •••• 2134', '1234 56•• •••• 2143']
  }

  

  changeBtn.forEach((el) => {
    el.addEventListener('click', () =>{
      modalProperties.deliveryType = '';
      modalProperties.cardNumber = '';
      modalProperties.title = el.previousElementSibling.innerHTML;

      let finalDeliveryType = [];
      let finalDeliveryAdress = [];
      let finalCardNumber = [];
      let finalCardName = [];
      
      if (el.parentNode.parentNode.querySelector('.section-delivery-middle__title') || el.parentNode.parentNode.querySelector('.section-total-middle__descr-adress')){
        finalDeliveryType.push(document.querySelector('.section-delivery-middle__title-place'));
        finalDeliveryType.push(document.querySelector('.section-total-middle__title-place'));
        finalDeliveryAdress.push(document.querySelector('.section-delivery-middle__descr-place'));
        finalDeliveryAdress.push(document.querySelector('.section-total-middle__descr-adress'));
        modalProperties.deliveryType = finalDeliveryType[0].innerHTML.trim();
        modalProperties.deliveryAdress = finalDeliveryAdress[0].innerHTML.trim();
      }else if(el.parentNode.parentNode.querySelector('.section-payment-bottom__card-number') || el.parentNode.parentNode.querySelector('.section-total-middle__descr-card-number')){
        finalCardNumber.push(document.querySelector('.section-payment-bottom__card-number'));
        finalCardNumber.push(document.querySelector('.section-total-middle__descr-card-number'));
        finalCardName.push(document.querySelector('.section-payment-bottom__card-icon'));
        finalCardName.push(document.querySelector('.section-total-middle__descr-icon'));
        modalProperties.cardNumber = finalCardNumber[0].innerHTML.trim();
      };

      createModal(modalProperties, finalDeliveryType, finalDeliveryAdress, finalCardNumber, finalCardName);
         
    });
  });


  function createModal(modalProperties, finalDeliveryType, finalDeliveryAdress, finalCardNumber, finalCardName){
    const { title, deliveryType, deliveryAdress, cardNumber, homeAdress, pointAdress, allCardsName, allCardsNumber} = modalProperties;

    const modal = document.createElement('div');
    const modalContainer = document.createElement('div');
    const modalHeader = document.createElement('div');
    const modalBtns = document.createElement('div');
    const modalCheckboxes = document.createElement('div');
    const modalSubmit = document.createElement('div');
    const modalCheckboxesList = document.createElement('ul');
    const modalTitle = document.createElement('h2');
    const modalCloseBtn = document.createElement('button');
    const modalDeliveryBtn1 = document.createElement('button');
    const modalDeliveryBtn2 = document.createElement('button');
    const modalDeliveryTitle = document.createElement('h3');
    const modalCheckbox = document.createElement('div');
    const modalSubmitBtn = document.createElement('button');

    modal.classList.add('modal', 'flex');
    modalContainer.classList.add('modal-container', 'flex');
    modalHeader.classList.add('modal-header', 'flex');
    modalCheckboxes.classList.add('modal-checkboxes', 'flex');
    modalSubmit.classList.add('modal-submit');
    modalCheckboxesList.classList.add('modal-checkboxes-list', 'list-resert');
    modalTitle.classList.add('modal-header__title');
    modalCloseBtn.classList.add('modal-header__btn', 'btn-resert');
    modalDeliveryTitle.classList.add('modal-checkboxes__title');
    modalCheckbox.classList.add('modal-checkbox');
    modalSubmitBtn.classList.add('modal-submit__btn', 'btn-resert');

    modalTitle.innerHTML = title;
    modalSubmitBtn.innerHTML = 'Выбрать';

    if(deliveryType){   
      modalBtns.classList.add('modal-delivery-btns', 'flex');
      modalDeliveryBtn1.classList.add('modal-delivery-btns__btn', 'btn-resert');
      modalDeliveryBtn2.classList.add('modal-delivery-btns__btn', 'btn-resert');
      modalDeliveryBtn1.innerHTML = 'В пункт выдачи';
      modalDeliveryBtn2.innerHTML = 'Курьером';

      

      if(deliveryType.toLowerCase().includes('пункт выдачи')){ 
        modalDeliveryBtn1.classList.add('modal-delivery-btns__btn-active');
        modalBtns.append(modalDeliveryBtn1);
        modalBtns.append(modalDeliveryBtn2);
        modalDeliveryTitle.innerHTML = 'Адреса пунктов выдачи';

        createModalCheckboxes(pointAdress, true, true, deliveryAdress, allCardsName, modalCheckboxesList);

      } else{
        modalDeliveryBtn2.classList.add('modal-delivery-btns__btn-active');
        modalBtns.append(modalDeliveryBtn1);
        modalBtns.append(modalDeliveryBtn2);
        modalDeliveryTitle.innerHTML = 'Мои адреса';

        createModalCheckboxes(homeAdress, false, true, deliveryAdress, allCardsName, modalCheckboxesList);
      };

      hangListenerOnModalBtns (modalDeliveryBtn1, modalDeliveryBtn2, pointAdress, homeAdress, deliveryAdress, allCardsName, modalCheckboxesList, modalDeliveryTitle);

    }else if(cardNumber){
      modalContainer.classList.add('modal-container-card');
      createModalCheckboxes(allCardsNumber, false, false, cardNumber, allCardsName, modalCheckboxesList);
    };

    modalCloseBtn.addEventListener('click', () =>{
      modal.remove();
      document.body.classList.remove('stop-scroll');
    });

    hangListenerOnModalCheckboxes(modalCheckboxesList);

    modalSubmitBtn.addEventListener('click', () =>{
      let boolean = false;
      for (let i=0; i<modalCheckboxesList.childNodes.length; i++){
        if(modalCheckboxesList.childNodes[i].firstChild.firstChild.checked === true){
          boolean = true;
          if(deliveryType){
            if (modalDeliveryBtn1.classList.contains('modal-delivery-btns__btn-active')){
              finalDeliveryType[0].innerHTML = 'Пункт выдачи';
              finalDeliveryType[1].innerHTML = 'Доставка в пункт выдачи';
              finalDeliveryAdress[0].innerHTML = modalCheckboxesList.childNodes[i].firstChild.childNodes[1].firstChild.innerHTML;
              finalDeliveryAdress[0].nextElementSibling.classList.remove('passive');
              finalDeliveryAdress[1].innerHTML = modalCheckboxesList.childNodes[i].firstChild.childNodes[1].firstChild.innerHTML;
            } else{
              finalDeliveryType[0].innerHTML = 'Курьер';
              finalDeliveryType[1].innerHTML = 'Курьером';
              finalDeliveryAdress[0].innerHTML = modalCheckboxesList.childNodes[i].firstChild.childNodes[1].firstChild.innerHTML;
              finalDeliveryAdress[0].nextElementSibling.classList.add('passive');
              finalDeliveryAdress[1].innerHTML = modalCheckboxesList.childNodes[i].firstChild.childNodes[1].firstChild.innerHTML;
            };
          } else if(cardNumber){
            for (j in finalCardNumber){
              finalCardNumber[j].innerHTML = modalCheckboxesList.childNodes[i].firstChild.childNodes[1].lastChild.innerHTML;
              finalCardName[j].classList.remove('modal-checkbox__icon-mir', 'modal-checkbox__icon-visa', 'modal-checkbox__icon-maestro', 'modal-checkbox__icon-mastercard');
              if(modalCheckboxesList.childNodes[i].firstChild.childNodes[1].firstChild.classList.contains('modal-checkbox__icon-mir')){
                finalCardName[j].classList.add('modal-checkbox__icon-mir');
              } else if (modalCheckboxesList.childNodes[i].firstChild.childNodes[1].firstChild.classList.contains('modal-checkbox__icon-visa')){
                finalCardName[j].classList.add('modal-checkbox__icon-visa');
              } else if (modalCheckboxesList.childNodes[i].firstChild.childNodes[1].firstChild.classList.contains('modal-checkbox__icon-mastercard')){
                finalCardName[j].classList.add('modal-checkbox__icon-mastercard');
              } else if (modalCheckboxesList.childNodes[i].firstChild.childNodes[1].firstChild.classList.contains('modal-checkbox__icon-maestro')){
                finalCardName[j].classList.add('modal-checkbox__icon-maestro');
              };
            };
          };
        };
      };
      if (boolean){
        modal.remove();
        document.body.classList.remove('stop-scroll');
      } else{
        for (let i=0; i<modalCheckboxesList.childNodes.length; i++){
          modalCheckboxesList.childNodes[i].firstChild.lastChild.classList.add('modal-checkbox__sign-error');
        };
      };
    });
    
    modalHeader.append(modalTitle);
    modalHeader.append(modalCloseBtn);
    if(deliveryType){
      modalCheckboxes.append(modalDeliveryTitle);
    }
    modalCheckboxes.append(modalCheckboxesList);
    modalSubmit.append(modalSubmitBtn);
    modalContainer.append(modalHeader);
    if(deliveryType){
      modalContainer.append(modalBtns);
    }
    modalContainer.append(modalCheckboxes);
    modalContainer.append(modalSubmit);
    modal.append(modalContainer);
    document.body.append(modal);
    document.body.classList.add('stop-scroll');
  };


  function hangListenerOnModalCheckboxes(modalCheckboxesList){
    for (let i=0; i<modalCheckboxesList.childNodes.length; i++){
      modalCheckboxesList.childNodes[i].firstChild.addEventListener('click', () => {
        if(modalCheckboxesList.childNodes[i].firstChild.firstChild.checked === true){
          for (let j=0; j<modalCheckboxesList.childNodes.length; j++){
            if (i!==j){
              modalCheckboxesList.childNodes[j].firstChild.firstChild.checked = false;
            };
            modalCheckboxesList.childNodes[j].firstChild.lastChild.classList.remove('modal-checkbox__sign-error');
          };
        };
      });
    };
  };

  function hangListenerOnModalBtns (btn, otherBtn, pointAdress, homeAdress, deliveryAdress, allCardsName, modalCheckboxesList, modalDeliveryTitle){
    btn.addEventListener('click', () =>{
      btn.classList.add('modal-delivery-btns__btn-active');
      otherBtn.classList.remove('modal-delivery-btns__btn-active');
      modalDeliveryTitle.innerHTML = 'Адреса пунктов выдачи';
      createModalCheckboxes(pointAdress, true, true, deliveryAdress, allCardsName, modalCheckboxesList);
      hangListenerOnModalCheckboxes(modalCheckboxesList);
    });
    otherBtn.addEventListener('click', () =>{
      otherBtn.classList.add('modal-delivery-btns__btn-active');
      btn.classList.remove('modal-delivery-btns__btn-active');
      modalDeliveryTitle.innerHTML = 'Мои адреса';
      createModalCheckboxes(homeAdress, false, true, deliveryAdress, allCardsName, modalCheckboxesList);
      hangListenerOnModalCheckboxes(modalCheckboxesList);
    });
  }


  function createModalCheckboxes(mass, deliveryType, isDelivery, checkedMeaning, allCardsName, modalCheckboxesList){
    while (modalCheckboxesList.firstChild) {
      modalCheckboxesList.removeChild(modalCheckboxesList.lastChild);
    }
    for (let i in mass){
      const modalCheckbox = document.createElement('li');
      const modalCheckboxLabel = document.createElement('lable');
      const modalCheckboxInput = document.createElement('input');
      const modalCheckboxDescr = document.createElement('div');
      const modalCheckboxText = document.createElement('span');
      const modalCheckboxInfo = document.createElement('div');
      const modalCheckboxInfoText = document.createElement('span');
      const modalCheckboxInfoStar = document.createElement('span');
      const modalCheckboxSign = document.createElement('span');
      const modalCheckboxIcon = document.createElement('span');
      const modalCheckboxDelete = document.createElement('button');

      modalCheckboxInput.type = 'checkbox';
      modalCheckboxInput.name = 'check';

      modalCheckbox.classList.add('modal-checkbox', 'flex');
      modalCheckboxLabel.classList.add('modal-checkbox__label', 'flex');
      modalCheckboxInput.classList.add('modal-checkbox__input');
      modalCheckboxSign.classList.add('modal-checkbox__sign');

      modalCheckboxText.innerHTML = mass[i];

      if(isDelivery){
        modalCheckboxDescr.classList.add('modal-checkbox__descr', 'flex');
        modalCheckboxText.classList.add('modal-checkbox__text');
        modalCheckboxInfo.classList.add('modal-checkbox__info');
        modalCheckboxInfoStar.classList.add('modal-checkbox__info-star');
        modalCheckboxDelete.classList.add('modal-checkbox__btn', 'btn-resert');
        modalCheckboxInfoStar.innerHTML = '4.99';
        modalCheckboxInfoText.innerHTML = 'Пункт выдачи';

        modalCheckboxDelete.addEventListener('click', () =>{
          modalCheckbox.remove();
        });
      }else{
        modalCheckbox.classList.add('modal-checkbox-card');
        modalCheckboxLabel.classList.add('modal-checkbox__label-card');
        modalCheckboxDescr.classList.add('modal-checkbox__text', 'flex');
        modalCheckboxIcon.classList.add('modal-checkbox__icon');

        switch(allCardsName[i]){
          case 'mir':
            modalCheckboxIcon.classList.add('modal-checkbox__icon-mir');
            break;
          case 'visa':
            modalCheckboxIcon.classList.add('modal-checkbox__icon-visa');
            break;
          case 'mastercard':
            modalCheckboxIcon.classList.add('modal-checkbox__icon-mastercard');
            break;
          case 'maestro':
            modalCheckboxIcon.classList.add('modal-checkbox__icon-maestro');
            break;
        };
      }
      

      modalCheckboxLabel.addEventListener('click', () =>{
        if(modalCheckboxInput.checked){
          modalCheckboxInput.checked = false;
        } else{
          modalCheckboxInput.checked = true;
        }
      });
      
      if(mass[i] === checkedMeaning){
        modalCheckboxInput.checked = true;
      };

      if(!isDelivery){
        modalCheckboxDescr.append(modalCheckboxIcon);
      };
      modalCheckboxDescr.append(modalCheckboxText);
      if(deliveryType){
        modalCheckboxInfo.append(modalCheckboxInfoStar);
        modalCheckboxInfo.append(modalCheckboxInfoText);
        modalCheckboxDescr.append(modalCheckboxInfo);
      };
      modalCheckboxLabel.append(modalCheckboxInput);
      modalCheckboxLabel.append(modalCheckboxDescr);
      modalCheckboxLabel.append(modalCheckboxSign);
      modalCheckbox.append(modalCheckboxLabel);
      if(isDelivery){
        modalCheckbox.append(modalCheckboxDelete);
      };
      modalCheckboxesList.append(modalCheckbox);
    };
    return(modalCheckboxesList);
  };
  

  function hangListenerOnInput(value, i){
    switch (i) {
      case '0':
        manageErrorElement(errorsInName(value), i);
        break;
      case '1':
        manageErrorElement(errorsInSurname(value), i);
        break;
      case '2':
        manageErrorElement(errorsInEmail(value), i);
        break;
      case '3':
        manageErrorElement(errorsInTel(value), i);
        break;
      case '4':
        manageErrorElement(errorsInIndex(value), i);
        break;
    };
  };


  function manageErrorElement(error, i){
    if(error){
      if(massInputs[i].parentNode.querySelector('.section-recipient-form__error')){
        massInputs[i].parentNode.querySelector('.section-recipient-form__error').classList.remove('passive');
        massInputs[i].parentNode.querySelector('.section-recipient-form__error').innerHTML = error;
      } else{
        let textError = document.createElement('span');
        textError.classList.add('section-recipient-form__error');
        if(massInputs[i].parentNode.querySelector('.section-recipient-form__info')){
          textError.classList.add('section-recipient-form__error-index');
        }
        textError.innerHTML = error;
        massInputs[i].parentNode.append(textError);
      };
      massInputs[i].classList.add('section-recipient-form__input-wrong');
    } else {
      if(massInputs[i].parentNode.querySelector('.section-recipient-form__error')){
        massInputs[i].parentNode.querySelector('.section-recipient-form__error').classList.add('passive');
        massInputs[i].classList.remove('section-recipient-form__input-wrong');
      }
    };
  };

  function errorsInName(name){
    let textErrorName = '';
    if (!name){
      textErrorName = 'Укажите имя';
    } else if(/[^a-z]/i.test(name) && /[^а-я]/i.test(name)){
      textErrorName = 'Имя может сожержать только буквы';
    }
    return(textErrorName);
  }

  function errorsInSurname(surname){
    let textErrorSurname = '';
    if (!surname){
      textErrorSurname = 'Введите фамилию';
    } else if(/[^a-z]/i.test(surname) && /[^а-я]/i.test(surname)){
      textErrorSurname = 'Фамилия может сожержать только буквы';
    } 
    return(textErrorSurname);
  }

  function errorsInEmail(email){
    let textErrorEmail = '';
    if (!email){
      textErrorEmail = 'Укажите электронную почту';
    } else if(!validateEmail(email)){
      textErrorEmail = 'Проверьте адрес электронной почты';
    }
    return(textErrorEmail);
  }

  function errorsInTel(tel){
    let textErrorTel = '';
    if (!tel){
      textErrorTel = 'Укажите номер телефона';
    } else if(!validateTel(tel)){
      textErrorTel = 'Формат: +9 (999) 999-99-99';
    }
    return(textErrorTel);
  }

  function errorsInIndex(index){
    let textErrorIndex = '';
    if (!index){
      textErrorIndex = 'Укажите индекс';
    } else if(index.length > 10) {
      textErrorIndex = 'Индекс не может быть длинне 10 цифр';
    } else if(!validateIndex(index)){
      textErrorIndex = 'Формат: 123456';
    }
    return(textErrorIndex);
  }

  

  function validateEmail(email){
    return email.match(
      /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
  };

  function validateTel(tel){
    return tel.match(
      /^[+][0-9][\s][(][0-9]{3}[)][\s][0-9]{3}[-][0-9]{2}[-][0-9]{2}$/
    );
  };

  function validateIndex(index){
    return index.match(
      /^([0-9]{6}|[0-9]{7}|[0-9]{8}|[0-9]{9}|[0-9]{10})$/
    );
  };



  function calculateTotalPrice(){
    let totalSumm = 0;
    let totalPreviousSumm = 0;
    let totalDiscount = 0;
    let totalAmount = 0;

    for (let i = 0; i<itemsAvailable.length; i++){
      if (itemsAvailable[i].classList.contains('section-cart-accordion-list__item-remain')) {
        if (itemsAvailable[i].querySelector('.section-cart-accordion-list__item-input').checked) {
          const itemAmount = parseInt(itemsAvailable[i].querySelector('.section-cart-accordion-list__item-count').innerHTML);
          const totalItemPrice = parseFloat((itemAmount*goodsPrices[i].itemPrice).toFixed(3));
          const totalItemPreviosPrice = parseFloat((itemAmount*goodsPrices[i].itemPreviosPrice).toFixed(3));
          
          totalSumm += totalItemPrice;
          totalPreviousSumm += totalItemPreviosPrice;
          totalAmount += itemAmount
          totalDiscount += itemAmount*goodsPrices[i].itemDiscount;

          const totalItemPriceText = itemsAvailable[i].querySelector('.section-cart-accordion-list__item-real-price-number');
  
          totalItemPriceText.innerHTML = makeStrfromNumber(totalItemPrice);
          itemsAvailable[i].querySelector('.section-cart-accordion-list__item-price-tooltip-text').innerHTML = makeStrfromNumber(totalItemPreviosPrice) + ' ' + 'сом';
          

          if (window.screen.availWidth < 685){
            if(totalItemPriceText.innerHTML.length > 10){
              totalItemPriceText.parentNode.parentNode.classList.add('column');
              itemsAvailable[i].querySelector('.section-cart-accordion-list__item-remain-content').classList.add('column-padding');
            } else{
              totalItemPriceText.parentNode.parentNode.classList.remove('column');
              itemsAvailable[i].querySelector('.section-cart-accordion-list__item-remain-content').classList.remove('column-padding');
            };
          } else{
            totalPrice.classList.remove('section-total-top__total-price-small');
            totalItemPriceText.parentNode.parentNode.classList.remove('column');
            itemsAvailable[i].querySelector('.section-cart-accordion-list__item-remain-content').classList.remove('column-padding');
            if(totalItemPriceText.innerHTML.length > 12){
              totalItemPriceText.classList.add('section-cart-accordion-list__item-real-price-number-too-big');
            } else if (totalItemPriceText.innerHTML.length > 6) {
              totalItemPriceText.classList.add('section-cart-accordion-list__item-real-price-number-big');
              totalItemPriceText.classList.remove('section-cart-accordion-list__item-real-price-number-too-big');
            } else {
              totalItemPriceText.classList.remove('section-cart-accordion-list__item-real-price-number-big');
            };
          };

          window.addEventListener('resize', () => {
            if (window.screen.availWidth < 685){
              if(totalItemPriceText.innerHTML.length > 10){
                totalItemPriceText.parentNode.parentNode.classList.add('column');
                itemsAvailable[i].querySelector('.section-cart-accordion-list__item-remain-content').classList.add('column-padding');
              } else{
                totalItemPriceText.parentNode.parentNode.classList.remove('column');
                itemsAvailable[i].querySelector('.section-cart-accordion-list__item-remain-content').classList.remove('column-padding');
              };
            } else{
              totalPrice.classList.remove('section-total-top__total-price-small');
              totalItemPriceText.parentNode.parentNode.classList.remove('column');
              itemsAvailable[i].querySelector('.section-cart-accordion-list__item-remain-content').classList.remove('column-padding');
              if(totalItemPriceText.innerHTML.length > 12){
                totalItemPriceText.classList.add('section-cart-accordion-list__item-real-price-number-too-big');
              } else if (totalItemPriceText.innerHTML.length > 6) {
                totalItemPriceText.classList.add('section-cart-accordion-list__item-real-price-number-big');
                totalItemPriceText.classList.remove('section-cart-accordion-list__item-real-price-number-too-big');
              } else {
                totalItemPriceText.classList.remove('section-cart-accordion-list__item-real-price-number-big');
              };
            };
          });
          
        };
      }

    }

    if (totalAmount%10===1 && totalAmount!==11){
      blockForPrice.querySelector('.section-total-top__item-amount').innerHTML = `${totalAmount}`+' '+'товар';
    } else if ((totalAmount%10===2 || totalAmount%10===3 || totalAmount%10==4) && (totalAmount!==12 || totalAmount!==13 || totalAmount!==14)){
      blockForPrice.querySelector('.section-total-top__item-amount').innerHTML = `${totalAmount}`+' '+'товара';
    } else{
      blockForPrice.querySelector('.section-total-top__item-amount').innerHTML = `${totalAmount}`+' '+'товаров';
    }

    totalPrice.innerHTML = makeStrfromNumber(totalSumm)  + ' ' + 'сом';
    blockForPrice.querySelector('.section-total-top__item-prev-price').innerHTML = makeStrfromNumber(totalPreviousSumm)  + ' ' + 'сом';
    blockForPrice.querySelector('.section-total-top__item-discount').innerHTML = '−'+ makeStrfromNumber(totalDiscount)  + ' ' + 'сом';

    if (payNowCheck.checked){
      oderBtn.innerHTML = 'Оплатить' + ' ' + `${totalPrice.innerHTML}`;
    };

    if (window.screen.availWidth < 1399) {
      if (totalPrice.innerHTML.length > 15){
        totalPrice.classList.add('section-total-top__total-price-small');
      } else {
        totalPrice.classList.remove('section-total-top__total-price-small');
      };
    };

    window.addEventListener('resize', () => {
      if (window.screen.availWidth < 1399) {
        if (totalPrice.innerHTML.length > 15){
          totalPrice.classList.add('section-total-top__total-price-small');
        } else {
          totalPrice.classList.remove('section-total-top__total-price-small');
        };
      };
    })

    calculateAmountInDilivery();
  };

  function makeStrfromNumber(number){
    const masNumber = `${number}`.split('');
    let strNumber ='';
    let count = 0;

    for (let i in masNumber){
      if(count%3===0 && masNumber[masNumber.length-1-i] !== '.'){
        strNumber += ' ';
      }
      if (masNumber[masNumber.length-1-i] === '.'){
        count = 0;
      } else {
        count++;
      }
      strNumber += `${masNumber[masNumber.length-1-i]}`;
      
    }

    const resultStr = strNumber.split('').reverse().join('');
    return(resultStr);
  };



  function calculateAmountInDilivery (){
    const deliveryDay = document.querySelector('.section-total-middle__descr-day');
    blocksDeliveryPhotos[0].parentNode.classList.remove('passive');
    blocksDeliveryPhotos[1].parentNode.classList.remove('passive');
    blocksDeliveryPhotos[0].parentNode.previousElementSibling.style.marginBottom = '';
    blocksDeliveryPhotos[1].parentNode.previousElementSibling.style.marginBottom = '';
    blocksDeliveryPhotos[0].parentNode.parentNode.style.marginBottom = '';
    blocksDeliveryPhotos[0].parentNode.parentNode.nextElementSibling.classList.remove('passive');
    deliveryDay.classList.remove('passive');
    deliveryDay.innerHTML = '5–8 фев';
    let countBottom = 0;
    let countTop = 0;
    listItemsAvailable.querySelectorAll('.section-cart-accordion-list__item-remain').forEach(function(el){

      let itemImg = el.querySelector('.section-cart-accordion-list__item-picture').getElementsByTagName("img")[0];
      let itemAmount = parseInt(el.querySelector('.section-cart-accordion-list__item-count').innerHTML);
      let itemSrc = itemImg.getAttribute('src');

      let imgDeliveryBlockTop = blocksDeliveryPhotos[0].querySelector(`[src='${itemSrc}']`);
      let imgDeliveryBlockBottom = blocksDeliveryPhotos[1].querySelector(`[src='${itemSrc}']`);
      
      if (el.querySelector('.section-cart-accordion-list__item-input').checked){
        countTop ++;
        imgDeliveryBlockTop.parentNode.classList.remove('passive');
        if (imgDeliveryBlockBottom) {
          imgDeliveryBlockBottom.parentNode.classList.remove('passive');
        }
    
        if (itemAmount === 1){
          imgDeliveryBlockTop.parentNode.querySelector('.section-delivery-middle__photo-descr-amount').classList.add('passive');
        } else {
          imgDeliveryBlockTop.parentNode.querySelector('.section-delivery-middle__photo-descr-amount').classList.remove('passive');
        };
        if (itemAmount > 184){
          imgDeliveryBlockTop.parentNode.querySelector('.section-delivery-middle__photo-descr-amount').innerHTML = `184`;
          if (itemAmount - 184 ===1 ) {
            imgDeliveryBlockBottom.parentNode.querySelector('.section-delivery-middle__photo-descr-amount').classList.add('passive');
          } else {
            imgDeliveryBlockBottom.parentNode.querySelector('.section-delivery-middle__photo-descr-amount').classList.remove('passive');
            imgDeliveryBlockBottom.parentNode.querySelector('.section-delivery-middle__photo-descr-amount').innerHTML = `${itemAmount - 184}`;
          };
          countBottom++;
        } else {
          imgDeliveryBlockTop.parentNode.querySelector('.section-delivery-middle__photo-descr-amount').innerHTML = `${itemAmount}`;
        };
      } else{
        imgDeliveryBlockTop.parentNode.classList.add('passive');
        if (imgDeliveryBlockBottom){
          imgDeliveryBlockBottom.parentNode.classList.add('passive');
        };
      };   
    });
    if(!countTop){
      blocksDeliveryPhotos[0].parentNode.classList.add('passive');
      blocksDeliveryPhotos[0].parentNode.previousElementSibling.style.marginBottom = '0';
      blocksDeliveryPhotos[0].parentNode.parentNode.style.marginBottom = '0';
      blocksDeliveryPhotos[0].parentNode.parentNode.nextElementSibling.classList.add('passive');
      deliveryDay.classList.add('passive');
    };
    if(!countBottom){
      blocksDeliveryPhotos[1].parentNode.classList.add('passive');
      blocksDeliveryPhotos[1].parentNode.previousElementSibling.style.marginBottom = '0';
      deliveryDay.innerHTML = '5–6 фев';
    };

    listItemsAvailable.querySelectorAll('.section-cart-accordion-list__item.passive').forEach(function(el){
      
      let itemImg = el.querySelector('.section-cart-accordion-list__item-picture').getElementsByTagName("img")[0];
      let itemSrc = itemImg.getAttribute('src');

      let imgDeliveryBlockTop = blocksDeliveryPhotos[0].querySelector(`[src='${itemSrc}']`);
      let imgDeliveryBlockBottom = blocksDeliveryPhotos[1].querySelector(`[src='${itemSrc}']`);

      imgDeliveryBlockTop.parentNode.classList.add('passive');
        if (imgDeliveryBlockBottom){
          imgDeliveryBlockBottom.parentNode.classList.add('passive');
        };
    });
    
  };

  calculateTotalPrice();

});

