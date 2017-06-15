import {
  cyan500, cyan700,
  pinkA200,
  grey100, grey300, grey400, grey500,
  white, darkBlack, fullBlack,
} from 'material-ui/styles/colors';

import {fade} from 'material-ui/utils/colorManipulator';
import spacing from 'material-ui/styles/spacing';

const dark_primary_color    = '#512DA8';
const default_primary_color = '#673AB7';
const light_primary_color   = '#D1C4E9';
const text_primary_color    = '#FFFFFF';
const accent_color          = '#7C4DFF';
const primary_text_color    = '#212121';
const secondary_text_color  = '#757575'; 
const divider_color         = '#BDBDBD';


export default {
  spacing: spacing,
  fontFamily: '"Helvetica Neue", "Calibri Light", Roboto, sans-serif',
  palette: {
    primary1Color: default_primary_color,
    primary2Color: dark_primary_color,
    primary3Color: light_primary_color,
    accent1Color: accent_color,
    accent2Color: light_primary_color,
    accent3Color: light_primary_color,
    textColor: primary_text_color,
    alternateTextColor: text_primary_color,
    canvasColor: white,
    borderColor: divider_color,
    disabledColor: fade(darkBlack, 0.3),
    pickerHeaderColor: cyan500,
    clockCircleColor: fade(darkBlack, 0.07),
    shadowColor: fullBlack,
  },
  fontIcon: {
    color: text_primary_color,
    hoverColor: text_primary_color
  },
  chip: {
    deleteIconColor: text_primary_color
  },
  textField: {
      underlineColor: divider_color,
      underlineFocusStyle: text_primary_color,
    },
};