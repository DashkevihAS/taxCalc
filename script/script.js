const navigationLinks = document.querySelectorAll('.navigation__link');
const calcElems = document.querySelectorAll('.calc');

const clearActiveClass = (nodeList, activeClass) => {
  nodeList.forEach((link) => {
    link.classList.remove(activeClass);
  });
};

navigationLinks.forEach((link) => {
  link.addEventListener('click', (e) => {
    e.preventDefault();

    clearActiveClass(navigationLinks, 'navigation__link_active');
    e.target.classList.add('navigation__link_active');

    clearActiveClass(calcElems, 'calc_active');

    const calcClass = e.target.dataset.tax;
    document.querySelector(`.${calcClass}`).classList.add('calc_active');
  });
});

// АУСН

const ausn = document.querySelector('.ausn');
const formAusn = ausn.querySelector('.calc__form');
const resulTaxAusn = ausn.querySelector('.result__tax');
const calcBtnReset = ausn.querySelector('.calc__btn-reset');
const calcLabelExpenses = ausn.querySelector('.calc__label_expenses');

calcLabelExpenses.style.display = 'none';

formAusn.addEventListener('input', () => {
  let incom = +formAusn.income.value;
  let expenses = +formAusn.expenses.value;

  if (formAusn.type.value === 'income') {
    calcLabelExpenses.style.display = 'none';

    resulTaxAusn.textContent = incom * 0.08;
  }
  if (formAusn.type.value === 'expenses') {
    calcLabelExpenses.style.display = 'flex';

    resulTaxAusn.textContent = (incom - expenses) * 0.2;
  }
});

calcBtnReset.addEventListener('click', () => {
  formAusn.income.value = '';
  formAusn.expenses.value = '';
  resulTax.textContent = '0';
});

// Самозанятый

const selfEmployment = document.querySelector('.self-employment');
const formSelf = selfEmployment.querySelector('.calc__form');
const resulTaxSelf = selfEmployment.querySelector('.result__tax');
const calcBtnResetSelf = selfEmployment.querySelector('.calc__btn-reset');

formSelf.addEventListener('input', () => {
  let incomU = +formSelf.incomU.value;
  let incomF = +formSelf.incomF.value;

  resulTaxSelf.textContent = incomU * 0.04 + incomF * 0.06;
});

calcBtnResetSelf.addEventListener('click', () => {
  formSelf.incomU.value = '';
  formSelf.incomF.value = '';
  resulTaxSelf.textContent = '0';
});
