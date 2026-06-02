import { ForestController } from "../core/forest-controller";

export async function save(forestControllerObj) {
    const forestString = JSON.stringify(forestControllerObj);

    // скачивание файла через эмуляцию нажатия по ссылке ('a')
    const file = new Blob([forestString], {type: 'json'});
    const a = document.createElement('a');
    const url = URL.createObjectURL(file);
    
    a.href = url;
    a.download = `forestSim-${Date.now()}.json`
    a.click();

    window.URL.revokeObjectURL(url);
}

export function load() {
    // используется promise т.к. операции открытия и чтения файла асинхронные
    return new Promise((resolve, reject) => {
        // открытие диалогового окна через эмуляцию нажатия по элементу input
        const input = document.createElement('input');
        input.type = 'file'; // принимаем файл
        input.accept = '.json' // добавляем фильтр по расширению json

        input.onchange = e => {
            const file = e.target.files[0];

            if(!file)
                return resolve(null);

            file.text().then(text => {
                try {
                    resolve(ForestController.createFromObject(JSON.parse(text)));
                } catch (parseError) {
                    console.error("Ошибка при чтении файла сохранения:", parseError);
                    resolve(null);
                }
            })
        }
        input.oncancel = () => {
            resolve(null)
        }

        input.click();
    })
}