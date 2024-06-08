import { StyleSheet } from "react-native";


export const styles = StyleSheet.create({

    txtHeading:{
fontWeight:'700',
fontSize:24,
lineHeight:36,
color:'#000'
    },
    txtsubHeading:{
        fontWeight:'400',
        fontSize:16,
        lineHeight:24,
        color:'#9DB2BF'
    },
    tabBtn:{
        height:60,

        alignItems: 'center',
        justifyContent: 'center',
        padding: 15,
        borderRadius: 60,
        marginTop: 25,
       
        width: '100%',
      
        alignSelf: 'center',
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 2,

        elevation: 1,
        backgroundColor: '#352C48',
      },
      
      shadow:{shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      
      elevation: 5,
    }
})