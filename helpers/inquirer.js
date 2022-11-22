import inquirer from "inquirer";
import colors from "colors";

const menuOpts = [
    {
      type: 'list',
      name: 'opt',
      message: 'Choose an option',
      choices: [
        { value: '1', name: `${'1'.green}. Search place` },
        { value: '2', name: `${'2'.green}. History` },
        { value: '0', name: `${'0'.green}. Exit` }
      ]
    }
]

const pauseOpts = {
    type: 'input',
    name: 'continue',
    message: 'Press ' + 'ENTER'.green + ' to continue'
}

export const showMenuOpts = async () => {
    console.log('===================')
    console.log('    Weather App    ')
    console.log('===================')
    const { opt } = await inquirer.prompt(menuOpts)
    return opt;
}

export const readInput = async (message, required = true) => {
  const question = [
    {
      type: "input",
      name: "answer",
      message,
      validate(value) {
        if (!required) return true;
        if (value.length === 0) return "Required answer";
        return true;
      },
    },
  ];

  const { answer } = await inquirer.prompt(question);
  return answer;
};

export const pause = async () => {
    console.log()
    await inquirer.prompt(pauseOpts)
    console.clear()
}

export const listPlaces = async (places = []) => {
    const choices = places.map((place, i) => {
        const idx = `${i+1}.`.green
        return {
            value: place.id,
            name: `${idx} ${place.name}`
        }
    })

    choices.unshift({
        value: '0',
        name: '0. '.green + ' Cancel'
     })

    const questions = [{
        type: 'list',
        name: 'id',
        message: 'Choose a place: ',
        choices
    }]

    const {id} = await inquirer.prompt(questions)
    return id;
}
