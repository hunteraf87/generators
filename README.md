# Генераторы и автоматы

## Менеджер потоков

Класс ThreadsManager запускает трудоемкие задачи с таймаутом выполнения не приводя 
к блокировке ввода/вывода, что позволяет системе выполнять параллельно и другие задачи.
При выполнении задач менеджер учитывает приоритеты
    
    'critical' - самый высокий
    'high' - высокий
    'low' - низкий

ThreadsManager имеет функции установки времени выполнения задач и времени ожидания до следующиего цикла запуска

    ThreadsManager.setExecutionTime(time: number)
    ThreadsManager.setWaitingTime(time: number)

Функция count() позволяет получить количество задач в менеджере.

    ThreadsManager.count()

Функции stop() и break() позволяют завершить задачу или все задачи соответственно.

    ThreadsManager.stop(ident)
    ThreadsManager.break()

Метод forEach обходит Iterable объект любой длины и применяет callback. 
Принимает в качестве параметров forEach(iterable, callback, options). 
Options является не обязательный, но при необходимости можно передать объект вида

    {
        priority: <priority>, // Приоритет задачи
        id: <id>                // Идентификатор задачи (для останови при необходимости)
    }

forEach возвращает Promise по завершении работы. Пример задачи:

    var countCritical = 0;
    var threadsManager = new ThreadsManager();
    
    threadsManager.forEach(
        new Array(50e7),
        () => countCritical++,
        { priority: "critical" }
    ).then(() => console.log('executed'));
