const formatCurrency = (n) =>
  new Intl.NumberFormat('ru-Ru', {
    style: 'currency',
    currency: 'RUB',
    maximumFractionDigits: 2,
  }).format(n);

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
  const incom = +formAusn.income.value;
  const expenses = +formAusn.expenses.value;

  if (formAusn.type.value === 'income') {
    calcLabelExpenses.style.display = 'none';

    resulTaxAusn.textContent = formatCurrency(incom * 0.08);
  }
  if (formAusn.type.value === 'expenses') {
    calcLabelExpenses.style.display = 'flex';

    resulTaxAusn.textContent = formatCurrency((incom - expenses) * 0.2);
  }
});

calcBtnReset.addEventListener('click', () => {
  formAusn.income.value = '';
  formAusn.expenses.value = '';
  resulTaxAusn.textContent = '0';
});

// Самозанятый и ИП НПД

const selfEmployment = document.querySelector('.self-employment');
const formSelfEmployment = selfEmployment.querySelector('.calc__form');
const resulTaxSelfEmployment = selfEmployment.querySelector('.result__tax');
const calcBtnResetSelfEmployment =
  selfEmployment.querySelector('.calc__btn-reset');

formSelfEmployment.addEventListener('input', () => {
  const incomEntity = +formSelfEmployment.entity.value;
  const incomIndividual = +formSelfEmployment.individual.value;

  resulTaxSelfEmployment.textContent = formatCurrency(
    incomEntity * 0.06 + incomIndividual * 0.04,
  );
});

calcBtnResetSelfEmployment.addEventListener('click', () => {
  formSelfEmployment.entity.value = '';
  formSelfEmployment.individual.value = '';
  resulTaxSelfEmployment.textContent = '0';
});
