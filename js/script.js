const main = document.querySelector('.main');
const selection = document.querySelector('.selection');
const title = document.querySelector('.main__title');

const getData = () => {
    return fetch('./quiz_db.json')
    .then(response => response.json())
    .then(data => data)
};

const render = (data) => {
    const list = document.querySelector('.selection__list');
    list.textContent = '';
    let buttons = []

    data.forEach((elem, index) => {
        const li = document.createElement('li');
        li.classList.add('selection__item');
        const button = document.createElement('button');
        button.classList.add('selection__btn');
        button.textContent = data[index].theme;
        button.dataset.id = data[index].id;
        li.append(button);
        list.append(li);
        buttons.push(button)
    })

    return buttons
};

const hideElements = (elem) => {
    let opacity = getComputedStyle(elem).getPropertyValue('opacity');

    const animation = () => {
        opacity -= 0.05;

        elem.style.opacity = opacity;

        if (opacity > 0) {
            requestAnimationFrame(animation)
        } else {
            elem.style.display = 'none';
        }
    };

    requestAnimationFrame(animation)
};

const createAnswers = (data) => {
    const type = data.type;
    console.log(data)
    return data.answers.map(item => {
        const label = document.createElement('label');
        label.classList.add('question__answer');
        const input = document.createElement('input');
        input.type = type;
        input.name = 'answer';
        input.className = `question__${type}`
        const text = document.createTextNode(item);
        label.append(input, text);
        return label;
    })
};

const renderQuiz = (quiz) => {
    hideElements(title);
    hideElements(selection);

    const questionBox = document.createElement('div');
    questionBox.classList.add('question', 'main__box');
    main.append(questionBox);

    let questionCount = 0;

    const showQuestion = () => {
        const data = quiz.list[questionCount];
        questionCount += 1;

        questionBox.textContent = '';
        
        const form = document.createElement('form');
        form.classList.add('question__form');
        form.dataset.count = `${questionCount}/${quiz.list.length}`;
        
        questionBox.append(form);
        const fieldset = document.createElement('fieldset');
        const legend = document.createElement('legend');
        legend.classList.add('main__subtitle', 'question__title');
        legend.textContent = data.question;
        const answer = createAnswers(data);
        const button = document.createElement('button');
        button.classList.add('main__btn', 'question__btn');
        button.textContent = 'Подтвердить'
        fieldset.append(legend, ...answer);
        form.append(fieldset, button);

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            let ok = false;
            const answer = [...form.answer].map(item => {
                if (item.checked) ok = true;
                return item.checked ? item.value : false;
            });

            if (ok) {
                console.log(answer)
            } else {
                console.log('21212')
            }
            
        })
    };

    showQuestion();
};

const addClick = (buttons, data) => {
    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            const quiz = data.find(item => {
                if (item.id === btn.dataset.id) {
                    return item
                }
            });

            renderQuiz(quiz)
        })
    })
}
 
const initQuiz = async () => {
    const data = await getData();
    const buttons = render(data);

    addClick(buttons, data)
};

initQuiz();