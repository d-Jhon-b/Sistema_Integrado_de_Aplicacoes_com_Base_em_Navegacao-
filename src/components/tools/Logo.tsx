import * as React from "react"
import Svg, {Circle, Path} from "react-native-svg"

export const LogoIcon = ()=>{
    <Svg width="100" height='100' viewBox="0 0 100 100">
        <Circle cx='50' cy='50' r='45' stroke='blue' strokeWidth='2.5' fill='green' />
        <Path d="M30 30 L70 70 M30 70 L70 30" stroke="white" strokeWidth="5" />
    </Svg>
}