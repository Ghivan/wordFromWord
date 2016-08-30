/**
 * @title Игра "Слова из слова"
 */
/**
 * @file game.js
 * @author Станислав Евстифеев
 * @description Игра "Слова из слова"
 * @version 1.0
 * @since 15/08/2016
 */

/**
 * Глобальный объект приложения
 * @namespace GAME
 */
var GAME = {
    /**
     * Создает ссылку на пространство имен.
     * @method GAME.namespace
     * @param {string} ns_string
     * Название пространства имен.
     * @returns {object} Ссылка на пространство имен
     */


    namespace: function (ns_string) {
        var parts = ns_string.split('.'),
            parent = GAME,
            i;

        if (parts[0] === 'GAME') {
            parts = parts.slice(1);
        }

        for (i = 0; i < parts.length; i += 1) {

            if (typeof parent[parts[i]] === 'undefined') {
                parent[parts[i]] = {};
            }

            parent = parent[parts[i]];
        }

        return parent;
    }
};

/**
 * Набор функций для выполнения операций над элементами.
 * @namespace {object} GAME.utils
 */

GAME.utils = {
    /**
     * Устанавливает новый класс для элемента.
     * @method GAME.utils.setClass
     * @param  {HTML-элемент} element
     * HTML-элемент, которому необходимо установить класс.
     * @param  {string} name
     * Имя присваемого класса.
     * @returns {boolean} Успешность операции
     */
    setClass: function (element, name) {

        if (typeof element !== 'object') {
            console.error('Элемент не передан!');
            return false;
        }

        var classList = element.classList,
            classString = name,
            classProperty;

        for (classProperty in classList) {
            if (classList.hasOwnProperty(classProperty)) {
                classString += (' ' + classList[classProperty]);
            }
            if (classList[classProperty] === name) {
                return false;
            }
        }

        element.setAttribute('class', classString);
        return true;
    },

    /**
     * Проверяет присутствие класса у элемента.
     * @method GAME.utils.locateClass
     * @param  {HTML-элемент} element
     * Проверяемый HTML-элемент.
     * @param  {string} name
     * Имя проверяемого класса.
     * @returns {boolean} Наличие класса
     */
    locateClass: function (element, name) {

        if (typeof element != 'object') {
            console.error('Элемент не передан!')
            return false;
        }

        var classList = element.classList,
            classProperty;

        for (classProperty in classList) {
            if (classList[classProperty] === name) {
                return true;
            }
        }

        return false;
    },

    /**
     * Удаляет класс у элемента.
     * @method GAME.utils.removeClass
     * @param  {HTML-элемент} element
     * Проверяемый HTML-элемент.
     * @param  {string} name
     * Имя удаляемого класса.
     * @returns {boolean} Успешность операции
     */
    removeClass: function (element, name) {

        if (typeof element != 'object') {
            console.error('Элемент не передан!')
            return false;
        }

        var classList = element.classList,
            classString = '',
            classProperty,
            execState = false;

        for (classProperty in classList) {
            if (classList.hasOwnProperty(classProperty)) {

                if (classList[classProperty] === name) {
                    execState = true;
                    continue;
                }

                classString += (' ' + classList[classProperty]);
            }
        }

        classString = classString.trim();
        element.setAttribute('class', classString);

        return execState;
    },

    /**
     * Создает клон элемента.
     * @param  {primitive|Array|object} object
     * Клонируемый элемент.
     * @returns {primitive|Array|object} Клон элемента
     */
    createClone: function (object) {

        var clone,
            createClone = GAME.utils.createClone;

        if ((typeof object === 'object') && !(Array.isArray(object))) {

            clone = {};
            for (var key in object) {
                clone[key] = createClone(object[key]);
            }

        } else if (Array.isArray(object)) {

            clone = object.slice(0);
    

        } else {

            clone = object;

        }

        return clone;
    },

    /**
     * Удаляет дочерние элементы.
     * @method GAME.utils.clearChildNodes
     * @param  {HTML-элемент} element
     * Очищаемый HTML-элемент.
     */
    clearChildNodes: function (element) {
        if (typeof element != 'object') {
            console.error('Элемент не передан!')
            return false;
        }

        var children = element.childNodes;

        for (var i = 0; i < children.length; i) {

            children[i].parentNode.removeChild(children[i])
        }
    }

}

/**
 * Звуки приложения и управление ними.
 * @namespace {object} GAME.sounds
 * @prop {object} foundWord 
 * Объект озвучки найденного слова.
 * @prop {HTML-элемент} soundControl
 * Кнопка управления звуком {@link GAME.sounds.soundControl}.
 */

GAME.sounds = (function () {

    /**
     * @member {boolean} GAME.sounds.muted
     * Состояние звука (включен/выключен).
     * @private
     */
    var muted = false,

        /**
         * @namespace {object} GAME.sounds.soundControl
         * @property {HTML-элемент} container
         * HTML-элемент для управления звуком.
         * @property {object} state
         * Состояние звука (включен, выключен).
         * @example state = {
         *              on: 'images/icons/buttons_small/soundON.png', //Путь к файлу с изображением "Включенный звук"
         *              off: 'images/icons/buttons_small/soundOFF.png'//Путь к файлу с изображением "Выключенный звук"
         *          }
         * @private
         * @description Содержит необходимую информацию для управления звуком. Свойству soundControl объекта {@link GAME.sounds} передается ссылка на элемент-контейнер (container), являющийся кнопкой переключения состояния звука.
         */
        soundControl = {
            container: document.createElement('img')
        };
    soundControl.state = {
        on: 'images/icons/buttons_small/soundON.png',
        off: 'images/icons/buttons_small/soundOFF.png'
    }

    soundControl.container.src = soundControl.state.on;
    soundControl.container.alt = 'Выключить звук';
    soundControl.container.title = 'Выключить звук';
    soundControl.container.addEventListener('click', function (e) {
        if (muted) {
            soundControl.container.src = soundControl.state.on;
            soundControl.container.alt = 'Выключить звук';
            soundControl.container.title = 'Выключить звук';
            muted = false;
        } else {
            soundControl.container.src = soundControl.state.off;
            soundControl.container.alt = 'Включить звук';
            soundControl.container.title = 'Включить звук';
            muted = true;
        }
    });

    /**
     * Озвучка при нахождении слова.
     * @member {object} GAME.sounds.foundWord
     * @private 
     * @prop {HTML-элемент} container 
     * HTML-элемент аудио.
     * @prop {HTML-элемент} oggSources
     * Для воспроизведения ogg-файлов. 
     * @prop {HTML-элемент} accSources
     * Для воспроизведения acc-файлов.
     * @prop {Function} play()
     * Воспроизведение звука нахождения слова.
     */
    var foundWord = (function () {
        var container = document.createElement('audio'),
            oggSources = document.createElement('source'),
            accSources = document.createElement('source');
        container.src = 'sounds/found.mp3';

        oggSources.src = 'sounds/found.ogg';
        oggSources.type = 'audio/ogg';
        accSources.src = 'sounds/found.acc';
        accSources.type = 'audio/acc';

        container.appendChild(oggSources);
        container.appendChild(accSources);
        return {

            play: function () {
                if (!muted) {
                    container.play()
                }
            }
        }
    })()

    return {
        foundWord: foundWord,
        soundControl: soundControl.container
    }
})()

/**
 * Отображение игры.
 * @namespace {object} GAME.view
 * @prop {HTML-элемент} gameContainer
 * Место на странице для игры.
 * @prop {HTML-элемент} combinedGameField
 * Cобранное игровое поле
 */
GAME.view = (function () {
    var view = GAME.namespace('GAME.view'),
        controller = GAME.namespace('GAME.controller'),
        gameField = GAME.namespace('GAME.view.gameField'),
        gameInfo = GAME.namespace('GAME.view.gameInfo'),
        gameTips = GAME.namespace('GAME.view.gameTips'),
        menu = GAME.namespace('GAME.view.menu');

    view.gameContainer = 'Need to be initilized';
    view.combinedGameField = document.createElement('div');

    /**
     * Игровая зона.
     * @namespace {object} GAME.view.gameField
     * @prop {HTML-элемент} container 
     * Контейнер для игровой области. Класс элемента 'gameField'.
     */
    gameField.container = document.createElement('div');
    gameField.container.setAttribute('class', 'gameField');

    /**
     * Отображение слова уровня.
     * @namespace {object} GAME.view.gameField.levelWord
     * @prop {HTML-элемент} container
     * Ссылка на HTML-элемент, содержащий слово уровня.
     */

    gameField.levelWord = (function () {
        var container = document.createElement('div');
        container.setAttribute('class', 'levelWord');

        return {
            container: container,

            /**
             * Вывод букв слова уровня. Класс для каждой буквы 'letter'.
             * @method GAME.view.gameField.levelWord.printLetters
             * @param {string} word
             * Слово уровня.
             */
            printLetters: function (word) {
                var max = word.length,
                    i;

                GAME.utils.clearChildNodes(container);

                for (i = 0; i < max; i++) {
                    var letter = document.createElement('div');
                    letter.setAttribute('class', 'letter');
                    letter.innerHTML = word[i];
                    letter.setAttribute('data-order', 0)

                    letter.addEventListener('click', function (e) {
                        controller.play(e.target);
                    })

                    container.appendChild(letter);
                }
            }
        }
    })();

    /**
     * Отображение слова пользователя.
     * @namespace {object} GAME.view.gameField.userWord
     * @prop {HTML-элемент} container
     * Ссылка на HTML-элемент, содержащий слово, вводимое пользователем. Класс элемента 'userWord'.
     */
    gameField.userWord = (function () {
        var container = document.createElement('div');
        container.setAttribute('class', 'userWord');

        return container
    })();

    /**
     * Отображение найденных слов.
     * @namespace {object} GAME.view.gameField.foundWords
     * @prop {HTML-элемент} container
     * Ссылка на HTML-элемент, содержащий найденные слова.
     * Присваиваемый класс элемент 'foundWords'
     */
    gameField.foundWords = (function () {
        var container = document.createElement('div'),

            /**
             * @member {object} GAME.view.gameField.foundWords.letterBlocks
             * Ссылки на HTML-контейнеры для слов одной длины.
             * @example letterBlock = {
             *              '3': '<div></div>',
             *              '4': '<div></div>',
             *          }
             * @private
             */
            letterBlocks = {},

            /** 
             * @member {object} GAME.view.gameField.foundWords.wordPosition
             * Коллекция массивов для хранения слов одной длины в алфавитном порядке.
             * @example  wordPosition = {
             *              '3': ['аил', 'али', 'инь', 'иол'],
             *              '4': ['линь', 'лиса', 'лист', 'лицо']
             *              }
             * @private 
             */
            wordPosition = {},

            /**
             * Создание контенера для хранения слов одной длины.
             * @func addLetterBlock
             * @param {string} word 
             * Найденное слово.
             * @return {HTML-элемент}
             * Контейнер для слов равной длине переданного.
             * @memberof GAME.view.gameField.foundWords
             * @private 
             */
            addLetterBlock = function (word) {
                var count = word.length;
                wordPosition[count] = [];
                letterBlocks[count] = document.createElement('div');
                letterBlocks[count].setAttribute('data-length', count)
                var heading = document.createElement('h3');

                if (count <= 4) {
                    heading.innerHTML = count + ' буквы';
                } else {
                    heading.innerHTML = count + ' букв';
                }

                letterBlocks[count].style.position = 'relative';
                letterBlocks[count].appendChild(heading);

                if (container.childNodes.length > 0) {
                    var position = 0,
                        max = container.childNodes.length,
                        i;
                    for (i = 0; i < max; i++) {
                        if (count > parseInt(container.childNodes[i].dataset.length)) {
                            position += 1;
                        } else {
                            break;
                        }
                    }
                    container.insertBefore(letterBlocks[count], container.childNodes[position]);

                } else {
                    container.appendChild(letterBlocks[count]);
                }
                return letterBlocks[word.length];
            };


        container.setAttribute('class', 'foundWords');

        return {
            container: container,

            /**
             * Добавление найденного слова.
             * @method GAME.view.gameField.foundWords.addFoundWord
             * @param {string} word
             * Найденное слово.
             */
            addFoundWord: function (word) {

                var elem = document.createElement('div'),
                    letterBlock = letterBlocks[word.length] || addLetterBlock(word),
                    position;

                elem.setAttribute('class', 'foundWord');
                elem.setAttribute('id', word);
                elem.innerHTML = word;

                wordPosition[word.length].push(word);
                wordPosition[word.length].sort();

                position = wordPosition[word.length].indexOf(word) + 1; //ошибка добавления второго элемента !исправлено добавлением+1

                if (letterBlock.childNodes[position]) {
                    letterBlock.insertBefore(elem, letterBlock.childNodes[position]);

                } else {
                    letterBlock.appendChild(elem);
                }

                elem.style.backgroundColor = '#e3efee';

                var returnBackground = function () {
                    elem.style.backgroundColor = '#dEd4b9';
                }

                setTimeout(returnBackground, 1000)

                elem.addEventListener('click', function (e) {
                    view.advices.showAdvice(dictionary.getDefinition(e.target.id));
                })
            },

            /**
             * Очистка контейнера для найденных слов.
             * @method GAME.view.gameField.foundWords.clearContainer
             */
            clearContainer: function () {
                GAME.utils.clearChildNodes(container);
                letterBlocks = {};
                wordPosition = {};
            }
        }
    })();

    /**
     * Информация о текущей сессии игры.
     * @namespace {object} GAME.view.gameInfo
     * @prop {HTML-элемент} container
     * HTML-элемент для области отображения информации о текущей сессии игры.
     * Класс элемента 'gameInfo'
     * @prop {HTML-элемент} heading
     * HTML-элемент заголовок области.
     */

    gameInfo.container = document.createElement('div');
    gameInfo.container.setAttribute('class', 'gameInfo');
    gameInfo.heading = document.createElement('h1');
    gameInfo.heading.innerHTML = 'Слова из слова';

    /**
     * Информация об игроке.
     * @namespace {object} GAME.view.gameInfo.userName
     * @prop {HTML-элемент} container
     * HTML-элемент для отображения имени игрока.
     */
    gameInfo.userName = (function () {
        var container = document.createElement('div');
        container.setAttribute('class', 'userName');
        return {

            container: container,

            /** Обновление имени игрока.
             * @method GAME.view.gameInfo.userName.setHeading
             * @param {string} name 
             * Имя игрока. 
             */
            setHeading: function (name) {
                container.innerHTML = 'Игрок: <span>' + name + '</span>';
            }
        };
    })();

    /**
     * Отображение текущего уровня.
     * @namespace {object} GAME.view.gameInfo.currentLevel
     * @prop {HTML-элемент} container
     * HTML-элемент для отображения текущего уровня.
     */
    gameInfo.currentLevel = (function () {
        var container = document.createElement('div');
        container.setAttribute('class', 'currentLevel');
        return {

            container: container,

            /** Обновление отображения текущего уровня.
             * @method GAME.view.gameInfo.currentLevel.setHeading
             * @param {string} name 
             * Текущий уровень.
             */
            setHeading: function (number) {
                container.innerHTML = 'Уровень: <span>' + number + '</span>';
            }
        };
    })();

    /**
     * Отображение набраных очков.
     * @namespace {object} GAME.view.gameInfo.score
     * @prop {HTML-элемент} container
     * HTML-элемент для отображения набранных очков.
     */
    gameInfo.score = (function () {
        var container = document.createElement('div');
        container.setAttribute('class', 'score');
        return {
            container: container,

            /** Обновление отображения набранных очков.
             * @method GAME.view.gameInfo.score.setHeading
             * @param {integer} number 
             * Набранные очки.
             */
            setHeading: function (number) {
                container.innerHTML = 'Очки: <span>' + number + '</span>';
            }
        };
    })();

    /**
     * Отображение карты уровней.
     * @namespace {object} GAME.view.gameInfo.levelMap
     * @prop {HTML-элемент} container
     * HTML-элемент для карты уровней.
     */
    gameInfo.levelMap = (function () {
        var parent = document.createElement('div'),
            menu = document.createElement('div'),
            map = document.createElement('div'),
            i;

        menu.setAttribute('class', 'menuLevel');
        parent.setAttribute('class', 'menuLabel');
        parent.innerHTML = 'Карта уровней &#8681;';
        map.setAttribute('class', 'levelMap');
        map.style.display = 'none';



        menu.addEventListener('mouseover', function () {
            map.style.display = 'block';
        });

        menu.addEventListener('mouseout', function () {
            map.style.display = 'none';
        });

        menu.appendChild(parent);
        menu.appendChild(map);

        return {
            container: menu,

            /** 
             * Создание карты уровней.
             * @method GAME.view.gameInfo.levelMap.createMap
             * @param {integer} quantity 
             * Количество уровней.
             */
            createMap: function (quantity) {
                for (i = 0; i < quantity; i++) {
                    var link = document.createElement('a');
                    link.textContent = i + 1;
                    link.setAttribute('class', 'levelButton');
                    link.addEventListener('click', function (e) {
                        if (GAME.utils.locateClass(e.target, 'reached')) {

                            controller.setLevel(Number(e.target.textContent));

                        }
                    })
                    map.appendChild(link);
                }
            },

            /** 
             * Активировать кнопку перехода на уровень.
             * @method GAME.view.gameInfo.levelMap.setActive
             * @param {integer} level 
             * Номер уровня.
             */
            setActive: function (level) {
                GAME.utils.setClass(map.childNodes[Number(level) - 1], 'reached');
            },

            /** 
             * Получить ссылки на кнопки перехода на уровень.
             * @method GAME.view.gameInfo.levelMap.getButtons
             */
            getButtons: function () {
                return map.childNodes;
            }
        };
    })();

    /**
     * Отображение прогресса.
     * @namespace {object} GAME.view.gameInfo.progressBar
     * @prop {HTML-элемент} container
     * HTML-элемент для отображения прогресса.
     */
    gameInfo.progressBar = (function () {
        var container = document.createElement('progress');

        container.addEventListener('click', function (e) {
            view.advices.showAdvice(e.target.title);
        });

        return {
            container: container,

            /** 
             * Обновить прогресс.
             * @method GAME.view.gameInfo.progressBar.setBar
             * @param {integer} current 
             * Количество отгаданных слов.
             * @param {integer} max 
             * Максимально возможное количество слов.
             */
            setBar: function (current, max) {
                container.setAttribute('max', max);
                container.setAttribute('value', current);
                container.setAttribute('title', 'Отгадано ' + current + ' из ' + max + ' слов');
            }
        }
    })();

    /**
     * Игровые подсказки.
     * @namespace {object} GAME.view.gameTips
     * @prop {HTML-элемент} container
     * HTML-контейнер для подсказок.
     */
    gameTips.container = (function () {
        var container = document.createElement('div'),
            heading = document.createElement('h2');
        container.setAttribute('class', 'tips');
        heading.textContent = 'Подсказки:';
        container.appendChild(heading);

        return container;
    })();

    /**
     * Подсказка определения неотгаданного слова.
     * @namespace {object} GAME.view.gameTips.wordDefinition
     */
    gameTips.wordDefinition = (function () {
        var container = document.createElement('img'),

            /** 
             * @member {object} GAME.view.gameTips.wordDefinition.config
             * Хранение путей к изображению для разных состояний.
             * @prop {string} src
             * Активное состояние.
             * @prop {string} src_gray
             * Неактивное состояние.
             * @private 
             */
            config = {
                src: 'images/icons/tips/definition.png',
                src_gray: 'images/icons/tips/definition_gray.png'
            };

        container.id = 'wordDefinition';
        container.title = 'Показать определение неотгаданного слова.';
        container.alt = 'Показать определение неотгаданного слова.';

        container.addEventListener('click', function (e) {
            controller.tips.use(e.target.id);
        })

        gameTips.container.appendChild(container);

        return {
            /** 
             * Активировать подсказку.
             * @method GAME.view.gameTips.wordDefinition.enable
             */
            enable: function () {
                container.src = config.src;
            },

            /** 
             * Деактивировать подсказку.
             * @method GAME.view.gameTips.wordDefinition.disable
             */
            disable: function () {
                container.src = config.src_gray;
            }
        }
    })()

    /**
     * Подсказка слова целиком.
     * @namespace {object} GAME.view.gameTips.holeWord
     */
    gameTips.holeWord = (function () {
        var container = document.createElement('img'),

            /** 
             * @member {object} GAME.view.gameTips.holeWord.config
             * Хранение путей к изображению для разных состояний.
             * @prop {string} src
             * Активное состояние.
             * @prop {string} src_gray
             * Неактивное состояние.
             * @private 
             */
            config = {
                src: 'images/icons/tips/word.png',
                src_gray: 'images/icons/tips/word_gray.png'
            };

        container.id = 'holeWord';
        container.title = 'Показать неотгаданное слово целиком.';
        container.alt = 'Показать неотгаданное слово целиком.';

        container.addEventListener('click', function (e) {
            controller.tips.use(e.target.id);
        })

        gameTips.container.appendChild(container);

        return {
            /** 
             * Активировать подсказку.
             * @method GAME.view.gameTips.holeWord.enable
             */
            enable: function () {
                container.src = config.src;
            },
            /** 
             * Деактивировать подсказку.
             * @method GAME.view.gameTips.holeWord.disable
             */
            disable: function () {
                container.src = config.src_gray;
            }
        }
    })()

    /**
     * Игровое меню.
     * @namespace {object} GAME.view.menu
     * @prop {HTML-элемент} container 
     * HTML-контейнер для показа меню.
     * @prop {HTML-элемент} smallView 
     * Мини-кнопка показа меню.
     */

    /**
     * Меню ввода имени игрока.
     * @namespace {object} GAME.view.menu.formForGame
     */
    menu.formForGame = (function () {
        var container = document.createElement('form'),
            label = document.createElement('label'),
            userName = document.createElement('input'),
            buttonGroup = document.createElement('div'),
            buttonOK = document.createElement('div'),
            buttonCancel = document.createElement('div');

        buttonOK.setAttribute('class', 'menuButton');
        buttonCancel.setAttribute('class', 'menuButton');
        buttonCancel.textContent = 'Отмена';

        label.setAttribute('for', 'userName');
        userName.setAttribute('id', 'userName');


        container.setAttribute('class', 'gameForm')
        container.appendChild(label);
        container.appendChild(userName);
        buttonGroup.appendChild(buttonOK);
        buttonGroup.appendChild(buttonCancel);
        container.appendChild(buttonGroup);

        var keyListener = function (e) { //Обработка нажатия на клавишу Enter
            if (e.keyCode === 13) {
                e.preventDefault();
                switch (buttonOK.textContent) {
                case 'Начать':
                    if (userName.value.trim() != '') {
                        menu.formForGame.closeForm();
                        controller.startNew(userName.value);
                    } else {
                        view.advices.showFloatAdvice('Введите Ваше имя!')
                    }
                    break;
                case 'Загрузить':
                    if (userName.value.trim() != '') {

                        if (!controller.loadResults(userName.value)) {
                            view.advices.showFloatAdvice('Такой игрок не играл!')
                        }
                    } else {
                        view.advices.showFloatAdvice('Введите Ваше имя!')
                    }

                }
            }
        }


        return {
            /** 
             * Открыть форму ввода.
             * @method GAME.view.menu.formForGame.openForm
             * @param {string} action 
             * Вариант действия (new, load).
             */
            openForm: function (action) {
                userName.value = '';
                document.addEventListener('keydown', keyListener);
                switch (action) {
                case 'new':
                    label.textContent = 'Введите Ваше имя:';
                    buttonOK.textContent = 'Начать';
                    buttonOK.onclick = function () {
                        if (userName.value.trim() != '') {
                            menu.formForGame.closeForm();
                            controller.startNew(userName.value);
                        } else {
                            view.advices.showFloatAdvice('Введите Ваше имя!')
                        }
                    };
                    break;
                case 'load':
                    label.textContent = 'Введите сохраненное имя';
                    buttonOK.textContent = 'Загрузить';
                    buttonOK.onclick = function () {
                        if (userName.value.trim() != '') {

                            if (!controller.loadResults(userName.value)) {
                                view.advices.showFloatAdvice('Такой игрок не играл!')
                            }
                        } else {
                            view.advices.showFloatAdvice('Введите Ваше имя!')
                        }
                    };
                    break;
                }
                buttonCancel.onclick = menu.formForGame.closeForm;

                view.showWithBackground(container);


            },

            /** 
             * Закрыть форму ввода.
             * @method GAME.view.menu.formForGame.closeForm
             */
            closeForm: function () {
                var elem = container;
                document.removeEventListener('keydown', keyListener);
                if (GAME.utils.locateClass(elem.parentNode, 'background')) {
                    elem = elem.parentNode;
                }
                elem.parentNode.removeChild(elem);
            }
        }

    })()

    /**
     * Помощь и правила игры.
     * @namespace {object} GAME.view.help
     * @prop {HTML-элемент} smallView 
     * Кнопка показа помощи.
     */
    view.help = GAME.namespace('GAME.view.help');

    /**
     * Показать помощь.
     * @method GAME.view.help.show
     */
    view.help.show = function () {
        view.showWithBackground(view.help.container);
    }

    view.help.smallView = (function () {
        var container = document.createElement('img');
        container.src = 'images/icons/buttons_small/help.png';
        container.title = 'Помощь';
        container.alt = 'Помощь';

        container.addEventListener('click', view.help.show)

        return container;
    })()

    menu.container = (function () {
        var container = document.createElement('div'),
            newGame = document.createElement('div'),
            loadGame = document.createElement('div'),
            aboutGame = document.createElement('div'),
            tableSore = document.createElement('div'),
            heading = document.createElement('h1');


        heading.innerHTML = 'Слова из слова';
        container.setAttribute('class', 'mainMenu');

        newGame.textContent = 'Новая игра';
        newGame.addEventListener('click', menu.formForGame.openForm.bind(newGame, 'new'));

        loadGame.textContent = 'Загрузить игру';
        loadGame.addEventListener('click', menu.formForGame.openForm.bind(loadGame, 'load'));

        aboutGame.textContent = 'Об игре';
        aboutGame.addEventListener('click', view.help.show);

        tableSore.textContent = 'Рекорды';
        tableSore.addEventListener('click', function () {
            GAME.results.showTableScore()
        });

        container.appendChild(heading);
        container.appendChild(newGame);
        container.appendChild(loadGame);
        container.appendChild(tableSore);
        container.appendChild(aboutGame);

        return container;

    })();

    menu.smallView = (function () {

        var button = document.createElement('img');
        button.src = 'images/icons/buttons_small/menuButton.png';
        button.alt = 'Меню';
        button.title = 'Игровое меню';
        button.addEventListener('click', function () {
            view.showWithBackground(menu.container)
        });

        return button;
    })();

    /**
     * Всплывающие окна и подсказки.
     * @namespace {object} GAME.view.advices
     */
    view.advices = {

        /**
         * Показать всплывающую подсказку.
         * @method GAME.view.advices.showFloatAdvice
         * @param {string} tipContent 
         * Содержание подсказки.
         */
        showFloatAdvice: function (tipContent) {
            var tipDiv = document.createElement('div');

            tipDiv.textContent = tipContent;
            tipDiv.setAttribute('class', 'tipСontainer');
            tipDiv.style.position = 'fixed';
            tipDiv.style.minWidth = '150px';
            tipDiv.style.top = '100px';
            tipDiv.style.color = '#64B6B1';
            tipDiv.style.fontWeight = 'bold';
            tipDiv.style.zIndex = 99999;
            tipDiv.style.fontSize = '150%';
            tipDiv.style.opacity = 1;
            view.gameContainer.appendChild(tipDiv);

            var timer = setInterval(function () {

                tipDiv.style.opacity = parseFloat(tipDiv.style.opacity) - 0.05;
                tipDiv.style.top = parseInt(tipDiv.style.top) - 5 + 'px';

            }, 50);

            function removeTip(timer, tipDiv) {
                clearInterval(timer);
                tipDiv.parentNode.removeChild(tipDiv);
            }

            setTimeout(function () {
                removeTip(timer, tipDiv);
            }, 1000)

            tipDiv.style.left = parseInt(window.getComputedStyle(document.body).width) / 2 - parseInt(window.getComputedStyle(tipDiv).width) / 2 + 'px';

        },

        /**
         * Показать подсказку в окне.
         * @method GAME.view.advices.showAdvice
         * @param {string} tipContent 
         * Содержание подсказки.
         */
        showAdvice: function (tipContent) {
            var tip = document.createElement('div');
            tip.textContent = tipContent;
            view.showWithBackground(tip);
        }

    }

    /**
     * Всплывающее окно.
     * @method GAME.view.showWithBackground
     * @param {HTML-элемент} element
     * HTML-элемент, который необходимо показать в окне.
     */
    view.showWithBackground = function (element) {
        var elemBackground = document.createElement('div'),

            blockade = function (e) { //блокировка срабатывания нажатия на элементе
                e.stopPropagation();
                e.cancelBubble = true;
            };
        elemBackground.style.zIndex = '1000';
        elemBackground.setAttribute('class', 'background');
        element.addEventListener('click', blockade);
        elemBackground.addEventListener('click', function (e) {
            elemBackground.parentNode.removeChild(elemBackground);
            element.removeEventListener('click', blockade);
        });
        elemBackground.appendChild(element);
        view.gameContainer.appendChild(elemBackground);
    }

    /**
     * Игровые задачи и бонусы.
     * @namespace {object} GAME.view.missions
     * @prop {HTML-элемент} container
     * HTML-контейнер для звезд.
     */
    view.missions = (function () {
        var container = document.createElement('div'),
            firstStar = document.createElement('img'),
            secondStar = document.createElement('img'),
            thirdStar = document.createElement('img'),
            complete = 'images/icons/missions/complete.png',
            incomplete = 'images/icons/missions/incomplete.png';

        container.setAttribute('class', 'missions');
        firstStar.src = incomplete;
        firstStar.alt = 'Первая звезда';

        secondStar.src = incomplete;
        secondStar.alt = 'Вторая звезда';

        thirdStar.src = incomplete;
        thirdStar.alt = 'Третья звезда';

        container.appendChild(firstStar);
        container.appendChild(secondStar);
        container.appendChild(thirdStar);

        return {
            container: container,

            /**
             * Активировать бонус.
             * @method GAME.view.missions.enable
             * @param {string} star
             * Номер звезды.
             */
            enable: function (star) {
                switch (star) {
                case 'first':
                    firstStar.src = complete;
                    break;
                case 'second':
                    secondStar.src = complete;
                    break;
                case 'third':
                    thirdStar.src = complete;
                    break;
                }
            },

            /**
             * Деактивировать бонус.
             * @method GAME.view.missions.disable
             * @param {string} star
             * Номер звезды.
             */
            disable: function (star) {
                switch (star) {
                case 'first':
                    firstStar.src = incomplete;
                    break;
                case 'second':
                    secondStar.src = incomplete;
                    break;
                case 'third':
                    thirdStar.src = incomplete;
                    break;
                }
            },

            /**
             * Обновить атрибут title у звезды.
             * @method GAME.view.missions.setTitle
             * @param {string} star
             * Номер звезды.
             * @param {string} title
             * Значение атрибута.
             */
            setTitle: function (star, title) {
                switch (star) {
                case 'first':
                    firstStar.title = title;
                    break;
                case 'second':
                    secondStar.title = title;
                    break;
                case 'third':
                    thirdStar.title = title;
                    break;
                }
            }
        }


    })()

    /**
     * Предзагрузчик.
     * @namespace {object} GAME.view.preloader
     * @prop {HTML-элемент} container
     * HTML-контейнер для предзагрузчика.
     */
    view.preloader = (function () {
        var preloader = document.createElement('object'),
            param = document.createElement('param');
        preloader.setAttribute('type', 'application/x-shockwave-flash');
        preloader.setAttribute('data', 'images/loader.swf');
        param.value = 'images/loader.swf';
        param.name = 'loader';

        preloader.appendChild(param);
        return {
            container: preloader,

            /**
             * Установить размеры предзагрузчика.
             * @method GAME.view.preloader.setWidth
             * @param {integer} width
             * Ширина.
             * @param {integer} height
             * Высота.
             */
            setWidth: function (width, height) {
                preloader.setAttribute('width', parseInt(width));
                preloader.setAttribute('height', parseInt(height));
            }
        };
    })()

    //сборка игрового поля

    //1. Сборка группы кнопок
    var buttonGroup = document.createElement('div');
    buttonGroup.setAttribute('class', 'buttonGroup');
    buttonGroup.appendChild(GAME.sounds.soundControl);
    buttonGroup.appendChild(view.menu.smallView);
    buttonGroup.appendChild(view.help.smallView);

    //2. Сборка игровой области
    gameField.container.appendChild(view.missions.container);
    gameField.container.appendChild(buttonGroup);
    gameField.container.appendChild(gameField.userWord);
    gameField.container.appendChild(gameField.levelWord.container);
    gameField.container.appendChild(gameField.foundWords.container);

    //3. Сборка области информации о текущей игре
    gameInfo.container.appendChild(gameInfo.heading);
    gameInfo.container.appendChild(gameInfo.userName.container);
    gameInfo.container.appendChild(gameInfo.currentLevel.container);
    gameInfo.container.appendChild(gameInfo.levelMap.container);
    gameInfo.container.appendChild(gameInfo.score.container);
    gameInfo.container.appendChild(gameInfo.progressBar.container);
    gameInfo.container.appendChild(gameTips.container);

    //4. Сборка всего игрового пространства
    view.combinedGameField.appendChild(gameInfo.container);
    view.combinedGameField.appendChild(gameField.container);


    return view
})()

/**
 * Модель (хранилище основных параметров) приложения.
 * @namespace {object} GAME.model
 * @prop {string} userName
 * Имя игрока.
 * @prop {string} userWord
 * Вводимое пользователем слово.
 * @prop {integer} currentLevel
 * Текущий уровень.
 * @prop {Array} wordsForLevel
 * Слова для уровней.
 * @prop {integer} score
 * Количество набранных очков.
 * @prop {object} level
 * Хранение данных пользователя по уровням.
 * @example level = {
 *      "1":{
 *        "wordForLevel":"родина",
 *        "foundWords":["род","анод","аир"],
 *        "missions": {
 *              "progress":3,
 *              "firstStar":true,
 *              "secondStar":true,
 *              "thirdStar":true
 *              }
 *          }
 *       }
 */
GAME.model = (function () {
    var model = GAME.namespace('GAME.model');

    model.userName = '';
    model.currentLevel = 0;
    model.userWord = '';
    model.wordsForLevel = ['родина', 'вечность', 'акробат', 'национальность'];
    model.score = 0;
    model.level = {}

    return model;
})()

/**
 * Контроллер приложения.
 * @namespace {object} GAME.controller
 */
GAME.controller = (function () {
    var model = GAME.namespace('GAME.model'),
        view = GAME.namespace('GAME.view'),
        controller = GAME.namespace('GAME.controller'),
        tips = GAME.namespace('GAME.controller.tips');

    /**
     * Удаление всего слова.
     * @method GAME.controller.clearInput
     */
    controller.clearInput = function () {
        model.userWord = '';
        view.gameField.userWord.textContent = model.userWord;
        var list = GAME.view.gameField.levelWord.container.childNodes;
        for (var i = 0; i < list.length; i++) {
            if (GAME.utils.locateClass(list[i], 'active')) {
                list[i].dataset.order = 0;
                GAME.utils.removeClass(list[i], 'active');
            }
        }
    }

    /**
     * Удаление буквы.
     * @method GAME.controller.clearLetter
     */
    controller.clearLetter = function () {
        var list = view.gameField.levelWord.container.childNodes;
        for (var i = 0; i < list.length; i++) {
            if (Number(list[i].dataset.order) === GAME.model.userWord.length) {
                list[i].dataset.order = 0;
                GAME.utils.removeClass(list[i], 'active')
            }
        }
        model.userWord = model.userWord.substr(0, GAME.model.userWord.length - 1);
        view.gameField.userWord.textContent = model.userWord;
    }

    /**
     * Сохранение результатов.
     * @method GAME.controller.storeResults
     * @param {string} name
     * Имя игрока.
     */
    controller.storeResults = function (name) {
        var results = {
            level: GAME.utils.createClone(model.level),
            score: model.score
        }
        results = JSON.stringify(results);
        window.localStorage.setItem(name, results);
    }

    /**
     * Загрузка сохраненных результатов.
     * @method GAME.controller.loadResults
     * @param {string} name
     * Имя игрока.
     */
    controller.loadResults = function (name) {
        if (window.localStorage[name]) {
            var style = window.getComputedStyle(view.gameContainer);
            GAME.utils.clearChildNodes(view.gameContainer);
            view.preloader.setWidth(style.width, '500px');
            view.gameContainer.appendChild(view.preloader.container);


            var results = JSON.parse(window.localStorage[name]),
                maxLevel = 1,
                levelMap = view.gameInfo.levelMap.getButtons();
            for (var i = 0; i < levelMap.length; i++) {
                GAME.utils.removeClass(levelMap[i], 'reached');
            }

            model.currentLevel = 0;
            model.userName = name;
            model.score = results.score;
            model.level = GAME.utils.createClone(results.level);

            view.gameInfo.userName.setHeading(name);




            if (model.level[model.wordsForLevel.length] && (model.level[model.wordsForLevel.length].foundWords.length >= Math.floor(dictionary.getVariants(model.wordsForLevel[model.wordsForLevel.length - 1]).length * 0.3))) {

                setTimeout(function () {
                    view.preloader.container.parentNode.removeChild(view.preloader.container);
                    GAME.view.gameInfo.container.appendChild(GAME.results.buttonScore);
                    GAME.results.showResults();

                }, 4000);
            } else {
                if (GAME.results.buttonScore.parentNode) {
                    GAME.results.buttonScore.parentNode.removeChild(GAME.results.buttonScore);
                }

                for (i in model.level) {
                    if (model.level.hasOwnProperty(i)) {
                        if (Number(i) > maxLevel) {
                            maxLevel = Number(i);
                        }
                    }
                }

                controller.setLevel(maxLevel);

                setTimeout(function () {
                    view.preloader.container.parentNode.removeChild(view.preloader.container);
                    view.gameContainer.appendChild(view.combinedGameField);

                }, 4000);
            }


            return true;
        } else return false;
    }

    /**
     * Начало новой игры.
     * @method GAME.controller.startNew
     * @param {string} name
     * Имя игрока.
     */
    controller.startNew = function (name) {
        var style = window.getComputedStyle(view.gameContainer);

        GAME.utils.clearChildNodes(view.gameContainer);
        view.preloader.setWidth(style.width, 550);
        view.gameContainer.appendChild(view.preloader.container);

        setTimeout(function () {
            view.preloader.container.parentNode.removeChild(view.preloader.container);
            view.gameContainer.appendChild(view.combinedGameField);

        }, 4000);
        var levelMap = view.gameInfo.levelMap.getButtons();
        for (var i = 0; i < levelMap.length; i++) {
            GAME.utils.removeClass(levelMap[i], 'reached');
        }
        model.currentLevel = 0;
        model.userName = name;
        model.level = {};
        model.score = 0;
        controller.setLevel(1);

        if (GAME.results.buttonScore.parentNode) {
            GAME.results.buttonScore.parentNode.removeChild(GAME.results.buttonScore);
        }

        view.gameInfo.userName.setHeading(name);
    }

    /**
     * Управление подсказками.
     * @namespace {object} GAME.controller.tips
     */

    /**
     * Обновление вида подсказок.
     * @method GAME.controller.tips.update
     */
    controller.tips.update = function () {
        var tips = GAME.namespace('GAME.view.gameTips');
        if (model.score < 100) {
            tips.wordDefinition.disable();
            tips.holeWord.disable();
        } else if (model.score < 500) {
            tips.wordDefinition.enable();
            tips.holeWord.disable();
        } else {
            tips.wordDefinition.enable();
            tips.holeWord.enable();
        }
    }

    /**
     * использование подсказок.
     * @method GAME.controller.tips.use
     * @param {string} variant
     * Тип подсказки (wordDefinition, holeWord).
     */
    controller.tips.use = function (variant) {

        var selected = false,
            variants = dictionary.getVariants(model.level[model.currentLevel].wordForLevel);

        if (model.level[model.currentLevel].foundWords.length === variants.length) {
            view.advices.showFloatAdvice('Все слова отгаданы');
            return;
        }

        while (!selected) {
            var advice = variants[Math.floor(Math.random() * variants.length)],
                tipContent = '';
            if (model.level[model.currentLevel].foundWords.indexOf(advice) === -1) {
                selected = true;
            }
        }

        switch (variant) {
        case 'wordDefinition':
            if (model.score >= 100) {
                model.score = model.score - 100;
                view.gameInfo.score.setHeading(model.score);
                advice = dictionary.getDefinition(advice);
            } else {
                tipContent = 100 - model.score;
            }
            break;

        case 'holeWord':
            if (model.score >= 500) {
                model.score = model.score - 500;
                view.gameInfo.score.setHeading(model.score);
            } else {
                tipContent = 500 - model.score;
            }
            break;
        }

        if (typeof tipContent === 'number') {
            view.advices.showFloatAdvice('Заработайте еще ' + tipContent + ' очков');
        } else {
            view.advices.showAdvice(advice);
            controller.storeResults(model.userName);
        }

        controller.tips.update();
    }

    /**
     * Переход на уровень.
     * @method GAME.controller.setLevel
     * @param {integer} number
     * Номер уровня.
     */
    controller.setLevel = function (number) {

        if (model.currentLevel === number) {
            return;
        }

        var level = GAME.namespace('GAME.model.level.' + number),
            i;

        model.currentLevel = number;

        level.wordForLevel = level.wordForLevel || model.wordsForLevel[number - 1];
        level.foundWords = level.foundWords || [];
        level.missions = level.missions || {}
        level.missions.progress = level.missions.progress || 0;

        view.missions.setTitle('first', 'Отгадайте больше 40% слов');
        view.missions.setTitle('second', 'Отгадайте 3 слова на букву "' + level.wordForLevel[0] + '"');
        view.missions.setTitle('third', 'Отгадайте 100% слов');
        controller.missions.set();

        controller.clearInput();

        view.gameField.levelWord.printLetters(level.wordForLevel);
        GAME.utils.clearChildNodes(view.gameField.foundWords.container);
        view.gameField.foundWords.clearContainer();
        for (i = 0; i < level.foundWords.length; i++) {
            view.gameField.foundWords.addFoundWord(level.foundWords[i]);
        }

        var levelMap = view.gameInfo.levelMap.getButtons();

        for (var levelNumber in model.level) {
            if (model.level.hasOwnProperty(levelNumber)) {
                GAME.utils.setClass(levelMap[levelNumber - 1], 'reached');
            }
        }


        controller.tips.update();

        view.gameInfo.currentLevel.setHeading(number);
        view.gameInfo.progressBar.setBar(model.level[number].foundWords.length, dictionary.getVariants(model.level[number].wordForLevel).length);
        view.gameInfo.score.setHeading(model.score);
        view.gameInfo.levelMap.setActive(model.currentLevel);
        controller.storeResults(model.userName);

        if (level.foundWords.length === dictionary.getVariants(level.wordForLevel).length) {
            view.advices.showAdvice('Все слова уровня ' + model.currentLevel + ' отгадны!');
        }

    }

    /**
     * Реакция на нажатие буквы.
     * @method GAME.controller.play
     * @param {HTML-элемент} letter
     * Элемент с буквой.
     */
    controller.play = (function () {
            var cancelClick = false;

            return function (letter) {
                var utils = GAME.namespace('GAME.utils'),
                    model = GAME.namespace('GAME.model'),
                    view = GAME.namespace('GAME.view'),
                    level = model.level[model.currentLevel],
                    variants; //Возможные варианты слов из слова уровня
                if (cancelClick) return;
                cancelClick = true;
                setTimeout(function () {
                    cancelClick = false;
                }, 200)
                if (utils.locateClass(letter, 'active')) {
                    //Буква уже была выбрана
                    if (Number(letter.dataset.order) === model.userWord.length) {
                        model.userWord = model.userWord.substr(0, model.userWord.length - 1);
                        view.gameField.userWord.textContent = model.userWord;
                        letter.dataset.order = 0; //Порядковый номер нажатой буквы
                        utils.removeClass(letter, 'active');

                    }
                } else {
                    //Невыбранная буква
                    utils.setClass(letter, 'active');
                    model.userWord += letter.textContent;
                    letter.dataset.order = model.userWord.length; //Порядковый номер нажатой буквы
                    view.gameField.userWord.textContent = model.userWord;

                    if (model.userWord.length < 3) return;

                    variants = dictionary.getVariants(level.wordForLevel)

                    if (variants.indexOf(model.userWord) !== -1) {
                        if (level.foundWords.indexOf(model.userWord) === -1) {
                            //Новое найденное слово
                            GAME.sounds.foundWord.play();
                            level.foundWords.push(model.userWord);
                            view.gameField.foundWords.addFoundWord(model.userWord);
                            view.gameInfo.progressBar.setBar(level.foundWords.length, variants.length);
                            controller.missions.check(model.userWord);

                            //Начисление очков
                            var BASEBID = 10;
                            if (model.userWord.length <= 3) {
                                model.score += model.userWord.length * BASEBID;
                            } else if (model.userWord.length <= 5) {
                                model.score += Math.floor(model.userWord.length * BASEBID * 1.25);
                            } else if (model.userWord.length <= 7) {
                                model.score += Math.floor(model.userWord.length * BASEBID * 1.50);
                            } else if (model.userWord.length <= 9) {
                                model.score += Math.floor(model.userWord.length * BASEBID * 1.75);
                            } else {
                                model.score += Math.floor(model.userWord.length * BASEBID * 2);
                            }
                            view.gameInfo.score.setHeading(model.score);
                            controller.tips.update();

                            //Очистка игрового поля для нового выбора и старт анимации
                            model.userWord = '';
                            view.gameField.userWord.textContent = model.userWord;
                            var timer = 0,
                                list = view.gameField.levelWord.container.childNodes;
                            for (var i = 0; i < list.length; i++) {
                                if (utils.locateClass(list[i], 'active')) {

                                    list[i].dataset.order = 0;

                                    (function (a, b) {
                                        setTimeout(function () {
                                            utils.setClass(a, 'rotate');
                                        }, b)

                                        setTimeout(function () {
                                            utils.removeClass(a, 'rotate')
                                            utils.removeClass(a, 'active');

                                        }, 1500 + b);


                                    })(list[i], timer)

                                    timer += 100;
                                }
                            }

                            //Проверка возможности перехода на новый уровень
                            if (level.foundWords.length === Math.floor(variants.length * 0.3)) {
                                if (model.currentLevel < model.wordsForLevel.length) {
                                    view.gameInfo.levelMap.setActive(model.currentLevel + 1);
                                    view.advices.showAdvice('Вы можете перейти на следующий уровень (воспользуйтесь картой уровней)');
                                    model.level[model.currentLevel + 1] = {
                                        foundWords: []
                                    }
                                } else {
                                    view.advices.showAdvice('Поздравляем! Вы прошли все уровни!');
                                    view.gameInfo.container.appendChild(GAME.results.buttonScore);
                                    GAME.results.addScoreToTable(model.userName, model.score);
                                }
                            }

                            if (level.foundWords.length === variants.length) {
                                view.advices.showAdvice('Все слова уровня отгадны!');
                            }

                            if (model.level[model.wordsForLevel.length] && model.level[model.wordsForLevel.length].foundWords && (model.level[model.wordsForLevel.length].foundWords.length >= Math.floor(variants.length * 0.3))) {
                                GAME.results.addScoreToTable(model.userName, model.score);
                            }

                            controller.storeResults(model.userName); //Сохранение результатов

                        } else {
                            //Слово уже было найдено
                            var elem = document.getElementById(model.userWord),
                                elemStyle = window.getComputedStyle(elem).backgroundColor;

                            if (elemStyle != "rgb(255, 255, 0)") {
                                elem.style.backgroundColor = 'yellow';

                                function returnBackground(style) {
                                    elem.style.backgroundColor = style;
                                }

                                setTimeout(function () {
                                    returnBackground(elemStyle);
                                }, 1000)
                            }
                        }
                    }


                }

            }
        })()
        /**
         * Управление бонусами и задачами игры.
         * @namespace {object} GAME.controller.missions
         */

    controller.missions = {
        /**
         * Установка значений и состояния миссий.
         * @method GAME.controller.missions.set
         */
        set: function () {
            var level = GAME.namespace('GAME.model.level.' + model.currentLevel)
            if (model.level[model.currentLevel].foundWords.length >= dictionary.getVariants(model.level[model.currentLevel].wordForLevel).length * 0.4) {
                view.missions.enable('first');
                level.missions.firstStar = true;

            } else {
                view.missions.disable('first');
                level.missions.firstStar = false;
            }
            if (model.level[model.currentLevel].missions.progress >= 3) {
                view.missions.enable('second');
                level.missions.secondStar = true;
            } else {
                view.missions.disable('second');
                level.missions.secondStar = false;
            }

            if (model.level[model.currentLevel].foundWords.length >= dictionary.getVariants(model.level[model.currentLevel].wordForLevel).length) {
                view.missions.enable('third');
                level.missions.thirdStar = true;
            } else {
                view.missions.disable('third');
                level.missions.thirdStar = false;
            }

        },

        /**
         * Проверка выполнения условий миссий.
         * @method GAME.controller.missions.check
         * @param {string} word
         * Проверяемое слово.
         */
        check: function (word) {
            if (!model.level[model.currentLevel].missions.firstStar && model.level[model.currentLevel].foundWords.length >= dictionary.getVariants(model.level[model.currentLevel].wordForLevel).length * 0.4) {
                model.score += 1000;
                view.missions.enable('first');
                model.level[model.currentLevel].missions.firstStar = true;
                view.advices.showAdvice('Поздравляем! Вы заработали 1000 очков!');

            }

            if (!model.level[model.currentLevel].missions.secondStar && word[0] === model.level[model.currentLevel].wordForLevel[0]) {
                model.level[model.currentLevel].missions.progress += 1;
            }

            if (!model.level[model.currentLevel].missions.secondStar && model.level[model.currentLevel].missions.progress >= 3) {
                view.missions.enable('second');
                model.level[model.currentLevel].missions.secondStar = true;
                model.score += 500;
                view.advices.showAdvice('Поздравляем! Вы заработали 500 очков!');
            }


            if (!model.level[model.currentLevel].missions.thirdStar && model.level[model.currentLevel].foundWords.length >= dictionary.getVariants(model.level[model.currentLevel].wordForLevel).length) {
                view.missions.enable('third');
                model.level[model.currentLevel].missions.thirdStar = true;
                view.advices.showAdvice('Поздравляем! Вы заработали 50000 очков!');

                model.score += 50000;
            }


        }
    }


    return controller;

})()

/**
 * Хранилище информации для пройденной игры.
 * @namespace {object} GAME.results
 * @prop {HTML-элемент} rcontainer
 * Контейнер-хранилище результатов.
 * @prop {HTML-элемент} buttonScore
 * Кнопка показа результатов.
 */
GAME.results = (function () {
    var view = GAME.namespace('GAME.view'),
        controller = GAME.namespace('GAME.controller'),
        model = GAME.namespace('GAME.model'),
        totalWords = model.wordsForLevel.map(function (word) {
            return dictionary.getVariants(word).length
        }),
        leaderBoard = JSON.parse(window.localStorage.getItem('leaderBoard')) || [],
        updateableBlocks = {},
        resultContainer = document.createElement('div'),
        heading = document.createElement('h2');

    resultContainer.setAttribute('class', 'results');

    updateableBlocks['score'] = heading;
    resultContainer.appendChild(heading);

    for (var i = 0; i < model.wordsForLevel.length; i++) {
        var container = document.createElement('div'),
            header = document.createElement('h3'),
            scoreContainer = document.createElement('div'),
            button = document.createElement('div');
        header.setAttribute('class', 'header');
        header.innerHTML = 'Уровень ' + (i + 1);

        scoreContainer.setAttribute('class', 'scoreContainer');
        updateableBlocks[i + 1] = scoreContainer;

        button.innerHTML = 'Улучшить результат';
        button.setAttribute('class', 'resultButton');
        
        function doBetter(level) {
                GAME.utils.clearChildNodes(GAME.view.gameContainer);
                GAME.controller.setLevel(level);
                GAME.view.gameContainer.appendChild(GAME.view.combinedGameField);
            }
        
        (function (level) {
            button.addEventListener('click', doBetter.bind(null, level));
        })(i + 1);

        container.appendChild(header);
        container.appendChild(scoreContainer);
        container.appendChild(button);
        resultContainer.appendChild(container);
    }
    
    resultContainer.appendChild(view.menu.smallView.cloneNode(true)).addEventListener('click', function () {
            view.showWithBackground(view.menu.container)
        });

    var tableScoreContainer = document.createElement('div'),
        listOfRecords = document.createElement('ol');

    tableScoreContainer.appendChild(listOfRecords);
    tableScoreContainer.setAttribute('class', 'tableScore');

    return {
        rcontainer: resultContainer,

        /**
         * Показывает результаты игры по уровням.
         * @method GAME.results.showResults
         */
        showResults: function () {
            var level = GAME.namespace('GAME.model.level'),
                userFoundWords = GAME.results.calculate();

            GAME.utils.clearChildNodes(GAME.view.gameContainer);

            updateableBlocks['score'].innerHTML = model.userName + ', Вы набрали ' + model.score + ' очков'
            for (var i in level) {
                if (level.hasOwnProperty(i)) {
                    updateableBlocks[i].innerHTML = 'Отгадано ' + Math.floor(userFoundWords[i - 1] / totalWords[i - 1] * 100) + '% слов';
                    if (userFoundWords[i - 1] === totalWords[i - 1]){
                        resultContainer.childNodes[i].getElementsByClassName('resultButton')[0].innerHTML = 'Полюбоваться!';
                    }
                }
            }
            GAME.view.gameContainer.appendChild(GAME.results.rcontainer)

        },

        /**
         * подсчет результатов прохождения.
         * @method GAME.results.calculate
         */
        calculate: function () {
            var level = GAME.namespace('GAME.model.level'),
                userFoundWords = [];

            for (var i in level) {
                if (level.hasOwnProperty(i)) {
                    userFoundWords.push(level[i].foundWords.length);
                }
            }

            return userFoundWords;
        },

        buttonScore: (function () {
            var button = document.createElement('div');
            button.setAttribute('class', 'resultButton');
            button.addEventListener('click', function () {
                GAME.results.showResults();
            });
            button.innerHTML = 'Показать результаты';
            return button;
        })(),


        /**
         * Добавление нового рекорда.
         * @method GAME.results.addScoreToTable
         * @param {string} name
         * Имя игрока.
         * @param {integer} score 
         * Набранные очки.
         */
        addScoreToTable: function (name, score) {

            if (!(score = Number(score))) {
                console.error('Передано неверное число!')
            }

            function compareScore(a, b) {
                return b.score - a.score;
            }


            for (var i = 0; i < leaderBoard.length; i++) {
                if (leaderBoard[i].name === name) {
                    if (Number(leaderBoard[i].score) < score) {
                        leaderBoard[i].score = score;
                        leaderBoard.sort(compareScore);
                        GAME.view.advices.showFloatAdvice('Поставлен новый рекорд!');
                        GAME.results.saveTableScore();
                        return true;
                    } else {
                        return false;
                    }

                }
            }

            leaderBoard.push({
                name: name,
                score: score
            });


            leaderBoard.sort(compareScore);

            while (leaderBoard.length > 5) {
                leaderBoard.pop();
            }

            for (var i = 0; i < leaderBoard.length; i++) {
                if (leaderBoard[i].name === name) {
                    GAME.view.advices.showFloatAdvice('Поставлен новый рекорд!');
                    GAME.results.saveTableScore();
                    break;
                }
            }

            return true;

        },


        /**
         * Получение таблицы рекордов.
         * @method GAME.results.getTableScore
         */
        getTableScore: function () {
            return GAME.utils.createClone(leaderBoard);
        },

        saveTableScore: function () {
            window.localStorage.setItem('leaderBoard', JSON.stringify(leaderBoard));
        },

        /**
         * Показать таблицу рекордов.
         * @method GAME.results.showTableScore
         */
        showTableScore: function () {
            var list = GAME.results.getTableScore();
            GAME.utils.clearChildNodes(listOfRecords);
            if (list.length === 0) {
                var message = document.createElement('p');
                message.innerHTML = 'Таблица результатов пуста'
                listOfRecords.appendChild(message);
                GAME.view.showWithBackground(tableScoreContainer);
                return
            }

            for (var i = 0; i < 5; i++) {
                if (list[i]) {
                    var tempElem = document.createElement('li');
                    tempElem.textContent = '<span>' + list[i].name + '</span>' + '<span>' + list[i].score;
                    if (list[i].score % 100 >= 11 && list[i].score % 100 <= 20) {
                        tempElem.textContent += ' очков' + '</span>';
                    } else {
                        if (list[i].score % 10 >= 5 || list[i].score % 10 === 0) {
                            tempElem.textContent += ' очков' + '</span>';
                        } else {
                            if (list[i].score % 10 >= 2) {
                                tempElem.textContent += ' очка' + '</span>';
                            } else {
                                if (list[i].score % 10 === 1) {
                                    tempElem.textContent += ' очко' + '</span>';
                                }
                            }
                        }
                    }

                    tempElem.innerHTML = tempElem.textContent;
                    listOfRecords.appendChild(tempElem);
                } else {
                    break;
                }
            }
            GAME.view.showWithBackground(tableScoreContainer);
        }


    }
})()

/**
 * Инициализация игры.
 * @method GAME.init
 * @param {HTML-элемент} place
 * Место на странице для игры.
 */
GAME.init = function (place) {
    var model = GAME.namespace('GAME.model'),
        view = GAME.namespace('GAME.view'),
        controller = GAME.namespace('GAME.controller');

    window.addEventListener('load', function () {
        view.gameContainer = document.getElementById(place);

        if (view.gameContainer === null) return console.error('Укажите правильный элемент-контейнер!');

        view.gameContainer.style.position = 'relative';

        view.help.container = document.getElementById('help').parentNode.removeChild(document.getElementById('help'));

        view.help.container.style.display = 'inline-block';

        view.gameContainer.appendChild(view.menu.container);

        GAME.view.gameInfo.levelMap.createMap(model.wordsForLevel.length);
        document.addEventListener('keydown', function (e) {

            if (e.keyCode === 27) {
                GAME.controller.clearInput();
            }

            if (e.keyCode === 8) {
                GAME.controller.clearLetter();
                if (GAME.view.combinedGameField.parentNode) {
                    e.preventDefault();
                }
            }

        })
    });


}


var TEST = {
    getLetters: function () {
        return document.getElementsByClassName('letter');
    },

    guessAll: function (word, index, startLetter) {
        var variants = dictionary.getVariants(word),
            letters = TEST.getLetters(),
            index = index || -1;

        for (var i = 0; i < variants.length; i++) {
            if (index === 0) return;
            if (document.getElementById(variants[i])) continue;
            for (var j = 0; j < variants[i].length; j++) {
                if (startLetter) {
                    if (startLetter != variants[i][0]) {
                        continue;
                    }
                }
                var letter;
                for (var k = 0; k < letters.length; k++) {
                    if (letters[k].innerHTML === variants[i][j] && !GAME.utils.locateClass(letters[k], 'active')) {
                        letter = letters[k];
                        break;
                    }
                }
                GAME.controller.play(letter)
            }

            for (var k = 0; k < letters.length; k++) {
                GAME.utils.removeClass(letters[k], 'active');
            }

            GAME.model.userWord = '';
            GAME.view.gameField.userWord.innerHTML = '';
            if (startLetter) {
                if (startLetter === variants[i][0]) {
                    index -= 1;
                }
            } else {
                index -= 1;
            }
        }

    },

    loadScore: function(){
        window.localStorage.setItem('TestGamer', '{"level":{"1":{"wordForLevel":"родина","foundWords":["ода","дрон","аир","дан","дао","дар","дно","идо","иод","ион","ноа","рад","род","анид","анод","дари","дина","дорн","ирод","нард","нора","норд","орда","рани","адрон","данио","динар","надир","народ","радио","радон","дон"],"missions":{"progress":3,"firstStar":true,"secondStar":true,"thirdStar":true}},"2":{"foundWords":["вес","нос","ост","ось","сев","сен","сет","сон","тео","тес","тон","чес","чет","чон","вено","соте","течь","стен","ость","сочень","свет","светоч"],"wordForLevel":"вечность","missions":{"progress":2,"firstStar":true,"secondStar":false,"thirdStar":false}},"3":{"foundWords":["табор","аак","акр","акт","ара","бак","бар","бат","боа","бок","бор","бот","бра","кат","коб","кор","кот","орт","раб","рак","рок","рот","тао","тар","ток","тор","абак","акат","араб","арак","арат","арба","арка","бакт","бара","барк","бора","борт","брак","брат","кара","карт","ката","кора","корт","краб","крот","окат","окра","роба","рота","тара","таро","тора","трак","трок","аборт","актор","аорта","бакор","барак","барка","карат","карта","катар","кобра","обкат","обрат","отара","ракат","табак","бакота","батрак","брокат","работа","торба"],"wordForLevel":"акробат","missions":{"progress":3,"firstStar":true,"secondStar":true,"thirdStar":true}},"4":{"foundWords":["аил","али","инь","иол","ион","лао","лат","лис","лит","лот","нас","нит","ноа","ноо","нос","оса","ост","ось","сан","сон","таи","тан","тао","тис","тол","тон","аист","алан","алас","альт","анис","аноа","илот","лань","ласт","лино","линт","линь","лиса","лист","лицо","лоно","лось","лото","наос","наст","нить","нота","осот","ость","стон","сталь","лата","салинон","стан","станиоль","лотос"],"wordForLevel":"национальность","missions":{"progress":3,"firstStar":true,"secondStar":true,"thirdStar":false}}},"score":213987}');
        GAME.controller.loadResults('TestGamer')
    }
}