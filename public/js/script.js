$(function() {
    const socket = io();

    // Функция для добавления слушателей событий на тайлы
    function addEventListeners(sensor, tile) {
        const renameBtn = tile.querySelector(".rename-btn");
        const nameEl = tile.querySelector(".name");

        renameBtn.addEventListener("click", () => {
            const newName = prompt("Введите новое имя для датчика:", sensor.name);
            if (newName) {
                const response = fetch(`/rename-sensor?sensorId=${sensor.id}&name=${newName}`);
                sensor.name = newName;
                nameEl.textContent = newName;
            }
        });
    }

    // Функция для создания группы тайлов
    function createTileGroup(group) {
        const html = `
        <div class="tile-group">
            <h3 class="group">${group}</h3>
            <div class="tiles" id="${group}"></div>
        </div>
        `;
        $('#sensors').append(html);
    }

    socket.on('sensors', function(data) {
        for (var index = 0; index < data.length; index++) {
            const id = data[index].id;
            const value = data[index].value;
            const SensorType = data[index].sensorType
            const sensorName = data[index].name
            const group = data[index].group;
            const $sensor = $('#' + data[index].selector);

            if ($sensor.length) {
                $sensor.find('.value').text(value);
                if (data[index].SensorIsCritical) {
                    $sensor.css("background-color","#d64343")
                }else{
                    $sensor.css("background-color","")
                }
            } else {
                // Если группы для данной категории нет, создаем ее
                if (!$('#' + group).length) {
                    createTileGroup(group);
                }
                var style = ''
                if (data[index].SensorIsCritical) {
                    style = "background-color:#d64343"
                }
                const html = `
                    <div class="tile" style="${style}" id="${id.replace(/\//g, '-')}">
                    <span class="name">${sensorName}</span>
                    <img class="icon" src="${SensorType.img}" />
                    <span class="type">${SensorType.name}</span>
                    <span class="value">${value}</span>
                    <button type="button" class="rename-btn">Переименовать</button>
                    </div>
                `;

                // Добавляем тайл в соответствующую группу
                $('#' + group).append(html);

                // Добавляем слушатель событий на только что созданный тайл
                const $newTile = $('#' + data[index].selector)[0];
                const newSensor = {
                    name: sensorName,
                    id:data[index].id
                };
                addEventListeners(newSensor, $newTile);
            }
        }
        
    });
});
