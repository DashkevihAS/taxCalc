const formatCurrency = (n) =>
  new Intl.NumberFormat('ru-Ru', {
    style: 'currency',
    currency: 'RUB',
    maximumFractionDigits: 2,
  }).format(n);

{
  // Навигация
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
}

{
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
}

{
  // Самозанятый и ИП НПД

  const selfEmployment = document.querySelector('.self-employment');
  const formSelfEmployment = selfEmployment.querySelector('.calc__form');
  const resulTaxSelfEmployment = selfEmployment.querySelector('.result__tax');
  const calcBtnResetSelfEmployment =
    selfEmployment.querySelector('.calc__btn-reset');
  const calcCompensation = selfEmployment.querySelector(
    '.calc__label_compensation',
  );
  const resultBlocksCompensation = selfEmployment.querySelectorAll(
    '.result__block_compensation',
  );

  const resultTaxCompensation = selfEmployment.querySelector(
    '.result__tax_compensation',
  );
  const resultTaxRestCompensation = selfEmployment.querySelector(
    '.result__tax_rest-compensation',
  );
  const resultTaxResult = selfEmployment.querySelector('.result__tax_result');

  const checkCompensation = () => {
    const setDisplay = formSelfEmployment.addCompensation.checked ? '' : 'none';
    calcCompensation.style.display = setDisplay;

    resultBlocksCompensation.forEach(
      (block) => (block.style.display = setDisplay),
    );
  };

  checkCompensation();

  formSelfEmployment.addEventListener('input', () => {
    const resEntity = +formSelfEmployment.entity.value * 0.06;
    const resndividual = +formSelfEmployment.individual.value * 0.04;

    checkCompensation();

    const tax = resEntity + resndividual;

    formSelfEmployment.compensation.value =
      formSelfEmployment.compensation.value > 10_000
        ? 10_000
        : formSelfEmployment.compensation.value;
    const benefit = formSelfEmployment.compensation.value;
    const awaitBenefit =
      +formSelfEmployment.individual.value * 0.01 +
      +formSelfEmployment.entity.value * 0.02;
    const restBenefit = benefit - awaitBenefit > 0 ? benefit - awaitBenefit : 0;
    const finalTax = tax - (benefit - restBenefit);

    resulTaxSelfEmployment.textContent = formatCurrency(tax);
    resultTaxCompensation.textContent = formatCurrency(benefit - restBenefit);
    resultTaxRestCompensation.textContent = formatCurrency(restBenefit);
    resultTaxResult.textContent = formatCurrency(finalTax);
  });

  calcBtnResetSelfEmployment.addEventListener('click', () => {
    formSelfEmployment.entity.value = '';
    formSelfEmployment.individual.value = '';
    formSelfEmployment.compensation.value = '';
    resulTaxSelfEmployment.textContent = '0';
    resultTaxCompensation.textContent = '0';
    resultTaxRestCompensation.textContent = '0';
    resultTaxResult.textContent = '0';
  });
}

{
  // ОСН/ОСНО
  const osno = document.querySelector('.osno');
  const formOsno = osno.querySelector('.calc__form');

  const resultBlockIp = osno.querySelectorAll('.result__block_ip');
  const resultBlockOoo = osno.querySelector('.result__block_ooo');

  const resultTaxNds = osno.querySelector('.result__tax_nds');
  const resultTaxProperty = osno.querySelector('.result__tax_property');
  const resultTaxndflExpenses = osno.querySelector(
    '.result__tax_ndfl-expenses',
  );
  const resultTaxNdflIncome = osno.querySelector('.result__tax_ndfl-income');
  const resultTaxProfit = osno.querySelector('.result__tax_profit');

  const checkFormBusiness = () => {
    if (formOsno.formBusiness.value === 'IP') {
      resultBlockOoo.style.display = 'none';
      resultBlockIp.forEach((block) => (block.style.display = ''));
    }
    if (formOsno.formBusiness.value === 'OOO') {
      resultBlockIp.forEach((block) => (block.style.display = 'none'));
      resultBlockOoo.style.display = '';
    }
  };

  checkFormBusiness();

  formOsno.addEventListener('input', () => {
    checkFormBusiness();

    const income = formOsno.income.value;
    const expenses = formOsno.expenses.value;
    const property = formOsno.property.value;

    const profit = income - expenses;

    // НДС
    const nds = income * 0.2;
    resultTaxNds.textContent = formatCurrency(nds);

    // Налог на имущество
    const taxProperty = property * 0.02;
    resultTaxProperty.textContent = formatCurrency(taxProperty);

    // НДФЛ(Вычет в виде расходов)
    const ndflExpensesTotal = profit * 0.13;
    resultTaxndflExpenses.textContent = formatCurrency(ndflExpensesTotal);

    // НДФЛ(Вычет 20% от доходов)
    const ndflIncomeTotal = (income - income * 0.2) * 0.13;
    resultTaxNdflIncome.textContent = formatCurrency(ndflIncomeTotal);

    // Налог на прибыль 20%
    const taxProfit = profit * 0.02;
    resultTaxProfit.textContent = formatCurrency(taxProfit);
  });

  const calcBtnResetOsno = osno.querySelector('.calc__btn-reset');
  calcBtnResetOsno.addEventListener('click', () => {
    resultTaxNds.textContent = 0;
    resultTaxProperty.textContent = 0;
    resultTaxndflExpenses.textContent = 0;
    resultTaxNdflIncome.textContent = 0;
    resultTaxProfit.textContent = 0;
    formOsno.income.value = '';
    formOsno.expenses.value = '';
    formOsno.property.value = '';
  });
}

{
  //УСН
  const LIMIT = 300_000;

  const usn = document.querySelector('.usn');
  const formUsn = usn.querySelector('.calc__form');

  const calcLabelExpenses = usn.querySelector('.calc__label_expenses');
  const calcLabelProperty = usn.querySelector('.calc__label_property');
  const resultBlockProperty = usn.querySelector('.result__block_property');

  const resulTaxTotal = usn.querySelector('.result__tax_total');
  const resulTaxProperty = usn.querySelector('.result__tax_property');

  const calcBtnResetUsn = usn.querySelector('.calc__btn-reset');

  const typeTax = {
    income: () => {
      calcLabelExpenses.style.display = 'none';
      calcLabelProperty.style.display = 'none';
      resultBlockProperty.style.display = 'none';

      formUsn.expenses.value = '';
      formUsn.property.value = '';
    },
    'ip-expenses': () => {
      calcLabelExpenses.style.display = '';
      calcLabelProperty.style.display = 'none';
      resultBlockProperty.style.display = 'none';

      formUsn.property.value = '';
    },
    'ooo-expenses': () => {
      calcLabelExpenses.style.display = '';
      calcLabelProperty.style.display = '';
      resultBlockProperty.style.display = '';
    },
  };

  const percent = {
    income: 0.06,
    'ip-expenses': 0.15,
    'ooo-expenses': 0.15,
  };

  typeTax[formUsn.typeTax.value]();

  formUsn.addEventListener('input', () => {
    typeTax[formUsn.typeTax.value]();

    const income = formUsn.income.value;
    const expenses = formUsn.expenses.value;
    const contributions = formUsn.contributions.value;
    const property = formUsn.property.value;

    let profit = income - contributions;

    if (formUsn.typeTax.value !== 'income') {
      profit -= expenses;
    }

    const taxBigIncome = income > LIMIT ? (profit - LIMIT) * 0.01 : 0;
    const summ = profit - (taxBigIncome < 0 ? 0 : taxBigIncome);
    const tax = summ * percent[formUsn.typeTax.value];
    const taxProperty = property * 0.02;

    resulTaxTotal.textContent = tax > 0 ? formatCurrency(tax) : 0;
    resulTaxProperty.textContent =
      taxProperty > 0 ? formatCurrency(taxProperty) : 0;
  });

  calcBtnResetUsn.addEventListener('click', () => {
    resulTaxTotal.textContent = '0';
    resulTaxProperty.textContent = '0';

    formUsn.income.value = '';
    formUsn.expenses.value = '';
    formUsn.contributions.value = '';
    formUsn.property.value = '';
  });
}
