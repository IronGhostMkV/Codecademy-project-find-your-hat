// The below code was initially written by "Codecademy" and then re-written here by me (Keith Nix) and then altered 
// to get the practice of writing and to gain understanding of their solution by analyzing the code. 

// Calling the  "prompt-sync" Node module to allow for getting player input while playing the game. 
const prompt = require('prompt-sync')({sigint: true});

// Initializing the variables (globally) and their symbols which will be used to depict the field, hat, hole, 
// and character path/current location
const hat = '^';
const hole = 'O';
const fieldCharacter = '░';
const pathCharacter = '*';

// Field class which contains the methods, objects, and functions for generating the field and playing the game 
class Field {
    // constructor "field" parameter initialized as a multi-dimensional array
    constructor(field = [[]]) {
        this.field = field;
        this.locationX = 0;
        this.locationY = 0;
        // Set the starting position of the player
        this.field[0][0] = pathCharacter;
    }
// Game method which will run the game until the player goes out of bounds, falls in a hole, or finds the hat
    runGame() {
        // initializes the "playing" variable for use by the while loop which sets the rules and calls the methods
        // to print the field, prompt the player for their input, check that location against the rules contained
        // within the if-else if statement block. End the game if the player goes out of bounds, falls in a hole
        // or finds the hat. Else, update the character path (player location and where they've been), reprint
        // the field, and prompt the player for their next move.  
        let playing = true;
        // While "playing" is true, print the field, prompt the player for their input on which way they want to go, 
        // check if they won/lost, and update the character path
        while (playing) {
            // print the field
            this.print();
            // prompt the player for their command of which way to go
            this.askQuestion();
            // if-else if statement to see if the player has died or won and end the game
            // if they did by updating "playing" to false which ends the while loop
            // if not in bounds, tell the player they lost and end the game
            if(!this.isInBounds()) {
                console.log('Out of bounds instruction! GAME OVER!!!');
                playing = false;
                break;
            // if the location the player is trying to go to is a hole, tell the player
            // they fell in a hole and end the game.
            } else if (this.isHole()) {
                console.log('Whoops, you fell in a hole! GAME OVER!!!');
                playing = false;
                break;
            // if the location the player is trying to go to is their hat, tell the player
            // they found their hat/won and end the game. 
            } else if (this.isHat()) {
                console.log('Congratulations, you\'ve found your hat!');
                playing = false;
                break;
            }
            // If the player hasn't died or found their hat update the current location on the map
            this.field[this.locationY][this.locationX] = pathCharacter;
        }
    }
// prompt the player with the question of which way they want to go to find their hat U, D, L, or R
// if a correct input has been entered, update the relevant variable. If an incorrect input has been 
// entered, inform the player of the acceptable choices and reprompt them for their input. 
    askQuestion() {
        // initialize the "answer" variable to the prompting question and make the user input upper case
        // once entered
        const answer = prompt('Which way? ').toUpperCase();
        // use the "answer" variable to check if the player input entered is valid or not.
        // if the input is valid, update the relevant variable accordingly. if not, the default case
        // will inform the player of the valid options and re-prompt for input.
        switch (answer) {
            // case 'U' will decriment the column array location by 1
            case 'U':
                this.locationY -= 1;
                break;
            // case 'D' will increment the column array location by 1 
            case 'D':
                this.locationY += 1;
                break;
            // case 'L' will decriment the row array location by 1
            case 'L':
                this.locationX -= 1;
                break;
            // case 'R' will incriment the row array location by 1
            case 'R':
                this.locationX += 1;
                break;
            // the default case will inform the player that they've entered an invalid input and re-prompt
            default:
                console.log('Enter U, D, L, or R. ');
                this.askQuestion();
                break;
        }
    }
// create a method to check if the location the player is trying to move to is "in bounds" and return a boolean
// value (true or false) accordingly which will be used by the runGame() method as one of the rules which will 
// result in GAME OVER 
    isInBounds() {
        return (
            // (top side of field) 
            // column array location is greater than or equal to 0 AND
            this.locationY >= 0 &&
            // (left side of field) 
            // row array location is greater than or equal to 0 AND
            this.locationX >= 0 &&
            // (bottom side of field) 
            // column array location is less than the field array length AND
            // We use the this.field.length because we are wanting to know how many nested arrays are present
            // because each nested array represents a row and the number of rows is our height and since the
            // top left corner of the grid is 0, 0 the Y increases it's value as we move towards the bottom of the field
            this.locationY < this.field.length &&
            // (right side of the field) 
            // row array location is less than the length of the array at index 0 
            // we specify one of the nested arrays .length because that will give us the number of elements present
            // in each of the nested arrays aka the width of the field and since the
            // top left corner of the grid is 0, 0 the X increases it's value as we move towards the right of the field
            this.locationX < this.field[0].length
        );
    }
// Method to check if the coordinates are equal to the 'hat' symbol '^' when called and return true or false
    isHat() {
        return this.field[this.locationY][this.locationX] === hat;
    }
// Method to check if the coordinates are equal to the 'hole' symbol 'O' when called and return true or false
    isHole() {
        return this.field[this.locationY][this.locationX] === hole;
    }
// print method which uses the array.map() function to create a new array populated with the 
// results of calling a provided function on every element in the calling array.
// "displayString" is the new array that we are creating for display purposes.
// In this case, it iterates through the nested arrays one at a time as it joins
// the elements of that nested array together into a sting without ',' and after printing one nested array it moves to 
// the next line and repeats until each nested array has been printed as it's own row.
// This allows us to create a visual image that follows the x and y coordinate system we want to use/depict
    print() {
        const displayString = this.field.map(row => {
            return row.join('');
        }).join('\n');
        console.log(displayString);
    }
// Create static generate field method. Static because we only want it created once when we call 
// it on the "Field" class outside of the class when we set the field parameters before playing the game.
// the method has 3 parameters: height, width, and percentage. 
    static generateField(height, width, percentage = 0.1) {
        // create const "field" variable to store the new Array that we are creating with the height and width 
        // values set outside of the class when we call the method on the class
        // This creates an array of nested arrays where the height equals the number of rows (each nested array
        // becomes one row) 
        // and the width equals number of columns (the number of elements each nested array contains)
        const field = new Array(height).fill(0).map(el => new Array(width));
        // for loop to iterate through the arrays and randomize whether they are a fieldCharactor '░' or a hole 'O'
        // y/height is the first for loop because it's the nested arrays and we want to fill each nested array with 
        // a symbol before moving on to the next nested array
        // x/width is the nested for loop because it will fill each element of the nested array with one of the symbols 
        // previously defined
        for(let y = 0; y < height; y++) {
            for(let x = 0; x < width; x++) {
                // create random probability variable for determining which symbol to fill that location with
                const prob = Math.random();
                // As the for loop iterates through the arrays fill the current location with either '░' or 'O'
                // If prob is greater than percentage, fill with fieldCharacter '░', else with hole 'O'
                field[y][x] = prob > percentage ? fieldCharacter : hole;
            }
        }
        // creating the hat location object
        const hatLocation = {
            // x property : random location for the x-axis (which index location of the nested array)
            x: Math.floor(Math.random() * width),
            // y property : random location for the y-axis (which nested array)
            y: Math.floor(Math.random() * height)
        };
        // making sure that the hat is not at the starting location
        // While the hat location equals the start location, get a different random number
        while (hatLocation.x === 0 && hatLocation.y === 0) {
            // update the hatLocation object property 'x' with new random number
            hatLocation.x = Math.floor(Math.random() * width);
            // update the hatLocation object property 'y' with new random number
            hatLocation.y = Math.floor(Math.random() * height);
        }
        // set the non-starting array location for the y and x arrays index as the hatLocation/hat symbol '^'
        field[hatLocation.y][hatLocation.x] = hat;
        // method returns the randomized field array of symbols
        return field;
    }
}
// create myField instance of the Field class by calling the .generateField() method on the Field class with the 
// number of (rows(height), columns(width), and percentage)
// This will create our field/map for us to play on and find our hat
const myField = new Field(Field.generateField(10, 20, 0.2));
// call the runGame() method on the new instance of the Field class: myField
myField.runGame();


