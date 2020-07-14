/*！
 * @file gamePad/main.ts
 * @brief DFRobot's gamer pad makecode library.
 * @n [Get the module here]()
 * @n This is the microbit dedicated handle library, which provides an API to 
 * control eight buttons, including an led indicator light and a vibrating motor.
 *
 * @copyright	[DFRobot](http://www.dfrobot.com), 2016
 * @copyright	GNU Lesser General Public License
 *
 * @author [email](1035868977@qq.com)
 * @date  2020-07-12
 */

/**
 * User Buttons for DFRobot gamer:bit Players.
 */

//%
enum GamerBitPin {
    //% block="Key Z"
    P8 = DAL.MICROBIT_ID_IO_P8,
    //% block="Key C"
    P13 = DAL.MICROBIT_ID_IO_P13,
    //% block="Key D"
    P14 = DAL.MICROBIT_ID_IO_P14,
    //% block="Key E"
    P15 = DAL.MICROBIT_ID_IO_P15,
    //% block="Key F"
    P16 = DAL.MICROBIT_ID_IO_P16
}

/**
 * Trigger Events Proposed by DFRobot gamer:bit Players.
 */

enum GamerBitEvent {
    //% block="pressed"
    Down = DAL.MICROBIT_BUTTON_EVT_DOWN,
    //% block="released"
    Up = DAL.MICROBIT_BUTTON_EVT_UP,
    //% block="click"
    Click = DAL.MICROBIT_BUTTON_EVT_CLICK,
}

//%
enum StateSelection{
    //%block="analog quantity"
    ANALOG,
    //%block="switch quantity"
    SWITCH
}

const _analog = 0;
const _switch = 1;

/**
 * Functions for DFRobot gamer:bit Players.
 */
//% weight=10 color=#DF6721 icon="\uf11b" block="GamePad"
namespace gamePad {
    let PIN_INIT = 0;
    let _speed    = -1;
    
    export enum Vibrator { 
        //% blockId="V0" block="stop"
        V0 = 0,
        //% blockId="V1" block="Vibration"
        V1 = 255,     
    }

    export enum Intensity { 
        //% blockId="I0" block="stop"
        I0 = 0,
        //% blockId="I1" block="weak"
        I1 = 100,
        //% blockId="I2" block="medium"
        I2 = 180,
        //% blockId="I3" block="strong"
        I3 = 225
    }

    // export enum Led {
    //     //% blockId="OFF" block="off"
    //     OFF = 0,
    //     //% blockId="ON" block="on"
    //     ON = 1
    // }


    //% shim=gamerpad::init
    function init(): void {
        return;
    }

    function PinInit(): void {
        //pins.setPull(DigitalPin.P1, PinPullMode.PullNone);
        //pins.setPull(DigitalPin.P2, PinPullMode.PullNone);
        pins.setPull(DigitalPin.P8, PinPullMode.PullNone);
        pins.setPull(DigitalPin.P13, PinPullMode.PullNone);
        pins.setPull(DigitalPin.P14, PinPullMode.PullNone);
        pins.setPull(DigitalPin.P15, PinPullMode.PullNone);
        //pins.setPull(DigitalPin.P0, PinPullMode.PullUp);
        pins.setPull(DigitalPin.P16, PinPullMode.PullUp);
        PIN_INIT = 1;
        return;
    }

    /**
     * To scan a button whether be triggered : return '1' if pressed; return'0' if not.
     */
    //% weight=70
    //% blockId=gamePad_keyState block="on|%button|is pressed"
    //% button.fieldEditor="gridpicker" button.fieldOptions.columns=3
    export function keyState(button: GamerBitPin): boolean {
        if (!PIN_INIT) { 
            PinInit();
        }
        let num = false;
        if (0 == pins.digitalReadPin(<number>button)) {
            num = true;
        }
        return num;
    }

    /**
     * Registers code to run when a DFRobot gamer:bit event is detected.
     */
    //% weight=60
    //%blockGap=50
    //% blockId=gamePad_onEvent block="on |%button|is %event"
    //% button.fieldEditor="gridpicker" button.fieldOptions.columns=3
    //% event.fieldEditor="gridpicker" event.fieldOptions.columns=3
    export function onEvent(button: GamerBitPin, event: GamerBitEvent, handler: Action) {
        init();
        if (!PIN_INIT) { 
            PinInit();
        }
        control.onEvent(<number>button, <number>event, handler); // register handler
    }

    /**
     * Vibrating motor switch.
     */
    //% weight=10
    //% blockId=gamePad_vibratorMotor block="Vibrator motor switch|%index|"
    //% index.fieldEditor="gridpicker" index.fieldOptions.columns=2
    export function vibratorMotor(index: Vibrator): void {
        if(_speed == -1){
            if (!PIN_INIT) 
                PinInit();
            let num = index * 4;
            pins.analogWritePin(AnalogPin.P12, <number>num);
        }else{
            if (!PIN_INIT) 
                PinInit();
            let num = _speed * 4;
            pins.analogWritePin(AnalogPin.P12, <number>num);
        }
        return;
    }

    /**
     * Vibration motor speed setting, adjustable range 0~255.
     */
    //% weight=15
    //% blockId=gamePad_vibratorMotorSpeed block="Vibrator motor intensity|%degree"
    //% degree.min=0 degree.max=255
    export function vibratorMotorSpeed(degree: number): void {
        _speed = degree;
        return;
    }


    /**
     * 获取摇杆的数据
     */
    //% weight=45
    //%blockId=gamePad_rockerX block="get rocker X direction %index"
    export function rockerX(index:StateSelection):number{

        switch(index){
            case _analog:
                return pins.analogReadPin(AnalogPin.P1);
                break;
            case _switch:
                if(pins.analogReadPin(AnalogPin.P1) >=700){
                    return 1;
                    break;
                }else if(pins.analogReadPin(AnalogPin.P1) <=300){
                    return 0;
                    break;
                }
            default:
                return -1;
        }
    }

    //% weight=40
    //% blockGap=50
    //%blockId=gamePad_rockerY block="get rocker Y direction %index"
    export function rockerY(index:StateSelection):number{

        switch(index){
            case _analog:
                return pins.analogReadPin(AnalogPin.P2);
                break;
            case _switch:
                if(pins.analogReadPin(AnalogPin.P2) >=700){
                    return 1;
                    break;
                }else if(pins.analogReadPin(AnalogPin.P2) <=300){
                    return 0;
                    break;
                }
            default:
                return -1;
        }
    }
 }