// src/lib/mui_theme.ts
import { createTheme } from '@mui/material/styles'

const muiTheme = createTheme({
  palette: {
    primary: {
      main: '#00f5cc', // TRAI Primärfarbe
      dark: '#00c9a9',
      contrastText: '#000',
    },
  },
  shape: {
    borderRadius: 2,
  },
})

export default muiTheme
