# Overall steps to defining blocks

1. Define blocks and put it in ```custom-block.ts```
2. If its options are tied to a robot model (action, expression, etc.), then write a function that fetches the supported operations of that robot model
    - Make sure to pass the supported functions as an array of type
        ```["value", OPTIONNAME<number>]``` in the dropdown field

    - Example, a robot supports 4 expressions: sad, happy, angry, and blink, then the option field is the following:

        ```js
        options: [
                    [
                        "sad",
                        "OPTIONNAME1"
                    ],
                    [
                        "happy",
                        "OPTIONNAME2"
                    ],
                    [
                        "angry",
                        "OPTIONNAME3"
                    ],
                    [
                        "blink",
                        "OPTIONNAME4"
                    ]
                ]```
                

3. Add code generation in ```js-generator.ts```
