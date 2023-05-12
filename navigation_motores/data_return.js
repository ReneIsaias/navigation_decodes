data_return = {
    save: {
        unitid: any,
        submodeloGPS: String,
        marcaGPS: String,
        modeloGPS: String,
        identificadorGPS: String,
        motorcom: Number,
        crudo: any,
        protocolomsn: String,
        protocolotipo: any,
        tipoMensaje: Number,
        serialmsn: any,
        registro: any,
        realtime: Boolean,
        modoReporte: any,
        latitud: Number,
        longitud: Number,
        velocidad: Number,
        direccion: Number,
        gpsFixed: Boolean,
        entradasDigital: Boolean,
        lbsBanda: String,
        lbsRegistro: Date,
        lbsMCC: Number,
        lbsMNC: Number,
        lbsTowers: {
            lacDecode: Number,
            ciDecode: Number
        },
        CMDMensaje: String,
        CMDBanderaSerial: Number,
        CMDEncode: String,
        CMDRegistro: Date,
    },
    error: string,
    identificadorUnitID: Number,
    respuesta: any,
}

cmdString = "78780E800800000000736F732300016D6A0D0A"

login_message_packet_gv20 = "{78 78} {0D} {01} {03 53 41 90 33 41 28 36} {00 0D} {33 51} {0D 0A}"
//                            XX XX   XX   XX   XX XX XX XX XX XX XX XX   XX XX   XX XX   XX XX => 18
login_message_packet_at6  = "{78 78} {11} {01} {{03 51 60 80 80 77 92 88} {22 03} {32 01}} {01 AA} {53 36} {0D 0A}"
//                            XX XX   XX   XX    XX XX XX XX XX XX XX XX   XX XX   XX XX    XX XX   XX XX   XX XX => 22

heartbeat_message_gv20 = "{78 78} {0A} {13} {{40} {04} {04} {00 02}} {00 0F} {33 8A} {0D 0A}"
//                         XX XX   XX   XX    XX   XX   XX   XX XX    XX XX   XX XX   XX XX => 15
heartbeat_message_at6  = "{78 78} {0B} {23} {{C0} {01 22} {04} {00 01}} {00 08} {18 72} {0D 0A}"
//                         XX XX   XX   XX    XX   XX XX   XX   XX XX    XX XX   XX XX   XX XX => 16

//36  || 40               78 78   23   12    15 0b 17 07 2a 08   c8   02 19 22 6e   0a a4 c7 50   37     fd 67  01 4e  14 2c   14 00   d1   66 00   00 00 00    01 91   be 25   0d 0a
position_message_gv20 = "{78 78} {23} {12} {{12 02 02 10 2A 17} {CB} {02 6C 17 8C} {0C 38 D0 3C} {00} | {54 2E} 01 CC {00 28} {66 00} {0F} {6F 00} {00 00 00}} {00 05} {1C D6} {0D 0A}"
//                        XX XX   XX   XX    XX XX XX XX XX XX   XX   XX XX XX XX   XX XX XX XX   XX   XX XX   XX XX   XX   XX XX   XX XX XX   XX XX   XX XX   XX XX => 36
//39                          
position_message_at6  = "{78 78} {22} {22} {{0F 0C 1D 02 33 05} {C9} {02 7A C8 18} {0C 46 58 60} {00} | {14 00} {01 CC} {00} {28 7D} {00 1F 71} {00} {00} {01}} {00 08} {20 86} {0D 0A}"
//                        XX XX   XX   XX    XX XX XX XX XX XX   XX   XX XX XX XX   XX XX XX XX   XX   XX XX   XX XX   XX   XX XX   XX XX XX   XX   XX   XX    XX XX   XX XX   XX XX => 39


alarm_message_GT06N = "{78 78} {25} {16} {{0F 0C 1D 0A 2B 21} {C8} {02 7A C8 04} {0C 46 58 10} {00} {14 6F} {'09'} {01 CC} {00} {28 7D} {00 1F 71} {48} {04} {04} {03 01}} {00 1C} {84 CF} {0D 0A}"
alarm_message_GV20  = "{78 78} {25} {16} {{11 02 0F 0E 04 04} {D0} {02 6C 19 72} {0C 38 D0 83} {00} {54 45} {'08'} {01 CC} {00} {28 66} {00 0E EE} {50} {04} {02} {02 02}} {00 0D} {8D 06} {0D 0A}"
//                      XX XX   XX   XX    XX XX XX XX XX XX   XX   XX XX XX XX   XX XX XX XX   XX   XX XX    XX    XX XX   XX   XX XX   XX XX XX   XX   XX   XX   XX XX    XX XX   XX XX   XX XX => 42

alarm_message_AT6   = "{78 78} {25} {26} {{0F 0C 1D 03 0B 26} {C9} {02 7A C8 18} {0C 46 58 60} {00} {04 00} {'09'} {01 CC} {00} {28 7D} {00 1F 71} {80} {04} {04} {13 02}} {FE} {00 0C} {47 2A} {0D 0A}"
//                      XX XX   XX   XX    XX XX XX XX XX XX   XX   XX XX XX XX   XX XX XX XX   XX   XX XX    XX    XX XX   XX   XX XX   XX XX XX   XX   XX   XX   XX XX    XX   XX XX   XX XX   XX XX => 43

comando_res_GV20 = "{78 78} {0E} {80} {{08} {00 00 00 00} {73 6F 73 23}} {00 01} {6D 6A} {0D 0A}"
//                   XX XX   XX   XX    XX   XX XX XX XX   XX XX XX XX    XX XX   XX XX   XX XX => 19

comando_res_AT6  = "{78 78} {0E} {80} {{08} {00 00 00 00} {73 6F 73 23}} {00 01} {6D 6A} {0D 0A}"
//                   XX XX   XX   XX    XX   XX XX XX XX   XX XX XX XX    XX XX   XX XX   XX XX => 19
comando_res_AT6_L= "{78 78} {0E} {80} {{08} {00 00 00 00} {73 6F 73 23} {00 02}} {00 01} {6D 6A} {0D 0A}"
//                   XX XX   XX   XX    XX   XX XX XX XX   XX XX XX XX   XX XX    XX XX   XX XX   XX XX => 21

alarm_packet_response_GV20 = "{78 78} {05} {16} {00 1C} {1B 28} {0D 0A}"
//                             XX XX   XX   XX   XX XX   XX XX   XX XX

alarm_packet_response_AT6  = "{78 78} {05} {26} {00 1C} {9D 86} {0D 0A}"
//                             XX XX   XX   XX   XX XX   XX XX   XX XX


AT6: {
    /* DataInfoSocket 353549090339515
        EL BIT DE INICIO DE CONCOX ES 7878 Y EL PAQUETE ES: 39
        ESTO ES UN MENSAJE EN 7878: 22
        ES UN LOGIN CONCOX POR UN UNITID: 353549090339515
        ENTRO DENTRO DEL SWITCH EN EL CASE: position_message
        ENTRO EN EL position_message PERO ES UN CONCOX AT6 POR EL BUFFER: 39 Y EL MSN QUE ES: 22
        SERIAL MSN EN AT6 : 53
        NO ENTRO PERO ES UN EN AT6 PARA LAS ENTRADAS DIGITALES: false */
    data: {
        save: {
            unitid: '353549090339515',
            crudo: '78782222150b16172926ca0218ffa00aa4cf0c4a3c20014e1401b00075d000000100353a7f0d0a',
            protocolomsn: 'position_message',
            protocolotipo: 1,
            marcaGPS: 'Concox',
            modeloGPS: 'AT6',
            identificadorGPS: 'AT6',
            tipoMensaje: 58,
            serialmsn: 53,
            registro: 2021-11-22T23:41:38.000Z,
            nosatelites: NaN,
            entradasDigital: [ false ],
            latitud: 19.55152,
            longitud: -99.20726,
            direccion: 32,
            velocidad: 74,
            realtime: false,
            gpsFixed: true,
            lbsBanda: '3G',
            lbsRegistro: 2021-11-22T23:41:38.000Z,
            lbsMCC: 334,
            lbsMNC: 20,
            lbsTowers: [ [Object] ],
            modoReporte: 58
        },
        respuesta: 'ok'
    }
}

GV20: {
    /* DataInfoSocket 359857084759356
        EL BIT DE INICIO DE CONCOX ES 7878 Y EL PAQUETE ES: 40
        ESTO ES UN MENSAJE EN 7878: 12
        ES UN LOGIN CONCOX POR UN UNITID: 359857084759356
        ENTRO DENTRO DEL SWITCH EN EL CASE: position_message_gv20
        ENTRO EN EL position_message_gv20 PERO ES UN CONCOX GV20 POR EL BUFFER: 40 Y EL MSN QUE ES: 12
        SERIAL MSN EN GV20 : 0
        ENTRO EN GV20 PARA LAS ENTRADAS DIGITALES: true,false,false,false,false */
    data: {
        save: {
            unitid: '359857084759356',
            crudo: '78782312150b17072a08c80219226e0aa4c75037fd67014e142c1400d166000000000191be250d0a',
            protocolomsn: 'position_message_gv20',
            protocolotipo: 1,
            marcaGPS: 'Concox',
            modeloGPS: 'GV20',
            identificadorGPS: 'GV20',
            tipoMensaje: 58,
            serialmsn: 0,
            registro: 2021-11-23T07:42:08.000Z,
            nosatelites: 8,
            entradasDigital: [ true, false, false, false, false ],
            latitud: 19.55647,
            longitud: -99.20616,
            direccion: 359,
            velocidad: 55,
            realtime: false,
            gpsFixed: true,
            lbsBanda: '3G',
            lbsRegistro: 2021-11-23T07:42:08.000Z,
            lbsMCC: 334,
            lbsMNC: 20,
            lbsTowers: [ [Object] ],
            modoReporte: 58
        },
        respuesta: 'ok'
    }

}


Heartbeat_packet_sent_by_terminal = {
    Protocol_Number: 1, //2
    Information_Content: {
        Voltage_Level: 1, // 2
    }
}

Server_Responds_The_Heartbeat_Packet = {
    Protocol_Number: 13, //23
}

Location_packet_sent_by_terminal = {
    Protocol_Number: 1, ///12 || 22
    Information_Content: {
        ACC: eliminar,
        Data_Upload_Mode: eliminar,
        GPS_Real_time_Re_upload: eliminar
    }
}

Mileage_location_data_packet = {
    add: true // Agregar toda esta nueva funcionalidad o no?
}

Alarm_Packet = {
    Alarm_packet_sent_by_terminal: {
        Protocol_Number: 16, //26 UTC
        Information_Conten: {
            LBS_Length: 1, // Parse of this byte is not mandatary, can be skipped
        }
    },
    //example
    //GV20 => 78 78 25 16 11 02 0F 0E 04 04 D0 02 6C 19 72 0C 38 D0 83 00 54 45 08 01 CC 00 28 66 00 0E EE 50 04 02 02 02 00 0D 8D 06 0D 0A
    //GT06N => 78 78 25 16 0F 0C 1D 0A 2B 21 C8 02 7A C8 04 0C 46 58 10 00 14 6F 09 01 CC 00 28 7D 00 1F 71 48 04 04 03 01 00 1C 84 CF 0D 0A

    //Alarm Packet（For multiple Geofences）
    // => 78 78 26 27 10 04 19 09 2D 07 C5 02 7A C9 1C 0C 46 58 00 00 05 37 09 00 00 00 00 00 00 00 00 80 02 00 0C 01 FF 00 00 4D F6 0D 0A


    Alarm_language: {
        Byte_1: [
            "0x0E: Low external battery alarm", // modifi
            '0XFE: ACC ON alarm', //add
            '0XFF: ACC OFF alarm' //add
        ]
    },


    Alarm_packet_response_of_server: {
        Protocol_Number: 1 //16 || 26 UTC

        //example
        // => 78 78 05 16 00 1C 1B 28 0D 0A
    }
}

Online_Command = {
    Online_command_sent_by_server: {
        Information_Content: {
            Length_of_Command: 1, //=> Server flag bit + command content length || Server flag bit + command content length
        }
    },
    //Example
    // => 78 78 0E 80 08 00 00 00 00 73 6F 73 23 00 01 6D 6A 0D 0A

    Online_command_replied_by_terminal: {
        Start_Bit: '0x78 0x78', // || 0x79 0x79
        Length_of_data_bit: 1, // || 2
        Protocol_Number: '0x15', // 0x21
        Information_Content: {
            Length_of_Command: 1, //add
            Command_Content: M, //verfifi
            Language: 2, //add
        }
    }

    //Example
    // => 78 78 28 15 20 00 00 00 00 53 4F 53 31 3A 31 33 34 32 31 36 33 32 36 39 39 20 53 4F 53 32 3A 20 53 4F 53 33 3A 00 01 00 2A C3 9C 0D 0A
}



Information_transmission_packet = {
    Information_transmission_packet_sent_by_terminal: {
        Information_Content: {
            Information_Type: 1, ////revisar bien cada bit
        }
    },

    //Example
    /* 
    7979007F9404414C4D313D43343B414C4D323D43433B414C4D333D34433B535441313D43303B4459443D
    30313B534F533D2C2C3B43454E5445523D3B46454E43453D46656E63652C4F4E2C302C32332E31313138
    30392C3131342E3430393236342C3430302C494E206F72204F55542C303B4D4946493D4D4946492C4F4646
    000A061E0D0A
    */

    Transmitted_information_content,
    //Example
    /* 
    ALM1=FF;ALM2=FF;ALM3=FF;STA1=CO ； DYD=01 ； SOS=12345 ， 2345 ， 5678 ；
    CENTER=987654;FENCE=FENCE,ON,0,-22.277120,-113.516763,5,IN,1；MODE=MODE,1,20,500
    */



    When_type_is_A6_this_bit_transmits_the_trip_mileage_statistics_between_ACC_ON_and_ACC_OFF_event: {
        add: 'revisar esta parte en la pag 19 porque se va a agregar'
    },



    LBS_Multiple_Bases_Extension_Packet = {
        Terminal_sent_LBS_multiple_bases_extension_packet: {
            Protocol_Number: 1, // 18 || 28
            Information_Content: {
                MNC: 2, // || 1 or 2
                Information_Serial_Number: eliminar,
            }
        }

        //Example
        /* 
        78 78 3B 18 10 01 0D 02 02 02 01 CC 00 28 7D 00 1F 71 3E 28 7D 00 1F 72 31 28 7D 00
        1E 23 2D 28 7D 00 1F 40 18 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 FF 00 02 00
        05 EF 4C 0D 0A
        */
    },


    TIME_calibration_packet = {
        Time_request_sent_by_terminal: "Al parecer esta igual",
        //example
        /* 78 78 05 8A 00 06 88 29 0D 0A */
        Serverresponsetimeinformation: "Al parecer esta igual"
        //Example
        /* 78 78 0B 8A 0F 0C 1D 00 00 15 00 06 F0 86 0D 0A */
    },
}

PacketeAlarmas= {
    0x00: "Normal",
    0x01: "SOS",
    0x02: "Power cut alarm",
    0x03: "Vibration alarm",
    0x04: "Enter Geofence alarm",
    0x05: "Exit Geofence alarm",
    0x06: "Over speed alarm",
    0x09: "Displacement alarm (Also named Moving Alarm or Towing Alarm)",
    0x0A: "Enter GPS dead zone alarm",
    0x0B: "Exit GPS dead zone alarm",
    0x0C: "Power on alarm",
    0x0D: "GPS First fix notice",
    0x0E: "Low external battery alarm",
    0x0F: "Low battery protection alarm",
    0x10: "SIM card change notice",
    0x11: "Power off alarm",
    0x12: "Airplane mode alarm",
    0x13: "Disassemble alarm",
    0x14: "Door alarm",
    0XFE: "ACC ON alarm",
    0XFF: "ACC OFF alarm",
    0x01: "Chinese",
    0x02: "EnglisH"
}



at6 = [
   `0X0000,0X1189,0X2312,0X329B,0X4624,0X57AD,0X6536,0X74BF,
    0X8C48,0X9DC1,0XAF5A,0XBED3,0XCA6C,0XDBE5,0XE97E,0XF8F7,
    0X1081,0X0108,0X3393,0X221A,0X56A5,0X472C,0X75B7,0X643E,
    0X9CC9,0X8D40,0XBFDB,0XAE52,0XDAED,0XCB64,0XF9FF,0XE876,
    0X2102,0X308B,0X0210,0X1399,0X6726,0X76AF,0X4434,0X55BD,
    0XAD4A,0XBCC3,0X8E58,0X9FD1,0XEB6E,0XFAE7,0XC87C,0XD9F5,
    0X3183,0X200A,0X1291,0X0318,0X77A7,0X662E,0X54B5,0X453C,
    0XBDCB,0XAC42,0X9ED9,0X8F50,0XFBEF,0XEA66,0XD8FD,0XC974,
    0X4204,0X538D,0X6116,0X709F,0X0420,0X15A9,0X2732,0X36BB,
    0XCE4C,0XDFC5,0XED5E,0XFCD7,0X8868,0X99E1,0XAB7A,0XBAF3,
    0X5285,0X430C,0X7197,0X601E,0X14A1,0X0528,0X37B3,0X263A,
    0XDECD,0XCF44,0XFDDF,0XEC56,0X98E9,0X8960,0XBBFB,0XAA72,
    0X6306,0X728F,0X4014,0X519D,0X2522,0X34AB,0X0630,0X17B9,
    0XEF4E,0XFEC7,0XCC5C,0XDDD5,0XA96A,0XB8E3,0X8A78,0X9BF1,
    0X7387,0X620E,0X5095,0X411C,0X35A3,0X242A,0X16B1,0X0738,
    0XFFCF,0XEE46,0XDCDD,0XCD54,0XB9EB,0XA862,0X9AF9,0X8B70,
    0X8408,0X9581,0XA71A,0XB693,0XC22C,0XD3A5,0XE13E,0XF0B7,
    0X0840,0X19C9,0X2B52,0X3ADB,0X4E64,0X5FED,0X6D76,0X7CFF,
    0X9489,0X8500,0XB79B,0XA612,0XD2AD,0XC324,0XF1BF,0XE036,
    0X18C1,0X0948,0X3BD3,0X2A5A,0X5EE5,0X4F6C,0X7DF7,0X6C7E,
    0XA50A,0XB483,0X8618,0X9791,0XE32E,0XF2A7,0XC03C,0XD1B5,
    0X2942,0X38CB,0X0A50,0X1BD9,0X6F66,0X7EEF,0X4C74,0X5DFD,
    0XB58B,0XA402,0X9699,0X8710,0XF3AF,0XE226,0XD0BD,0XC134,
    0X39C3,0X284A,0X1AD1,0X0B58,0X7FE7,0X6E6E,0X5CF5,0X4D7C,
    0XC60C,0XD785,0XE51E,0XF497,0X8028,0X91A1,0XA33A,0XB2B3,
    0X4A44,0X5BCD,0X6956,0X78DF,0X0C60,0X1DE9,0X2F72,0X3EFB,
    0XD68D,0XC704,0XF59F,0XE416,0X90A9,0X8120,0XB3BB,0XA232,
    0X5AC5,0X4B4C,0X79D7,0X685E,0X1CE1,0X0D68,0X3FF3,0X2E7A,
    0XE70E,0XF687,0XC41C,0XD595,0XA12A,0XB0A3,0X8238,0X93B1,
    0X6B46,0X7ACF,0X4854,0X59DD,0X2D62,0X3CEB,0X0E70,0X1FF9,
    0XF78F,0XE606,0XD49D,0XC514,0XB1AB,0XA022,0X92B9,0X8330,
    0X7BC7,0X6A4E,0X58D5,0X495C,0X3DE3,0X2C6A,0X1EF1,0X0F78`
]

gv20 = [
   `0X0000,0X1189,0X2312,0X329B,0X4624,0X57AD,0X6536,0X74BF,
    0X8C48,0X9DC1,0XAF5A,0XBED3,0XCA6C,0XDBE5,0XE97E,0XF8F7,
    0X1081,0X0108,0X3393,0X221A,0X56A5,0X472C,0X75B7,0X643E,
    0X9CC9,0X8D40,0XBFDB,0XAE52,0XDAED,0XCB64,0XF9FF,0XE876,
    0X2102,0X308B,0X0210,0X1399,0X6726,0X76AF,0X4434,0X55BD,
    0XAD4A,0XBCC3,0X8E58,0X9FD1,0XEB6E,0XFAE7,0XC87C,0XD9F5,
    0X3183,0X200A,0X1291,0X0318,0X77A7,0X662E,0X54B5,0X453C,
    0XBDCB,0XAC42,0X9ED9,0X8F50,0XFBEF,0XEA66,0XD8FD,0XC974,
    0X4204,0X538D,0X6116,0X709F,0X0420,0X15A9,0X2732,0X36BB,
    0XCE4C,0XDFC5,0XED5E,0XFCD7,0X8868,0X99E1,0XAB7A,0XBAF3,
    0X5285,0X430C,0X7197,0X601E,0X14A1,0X0528,0X37B3,0X263A,
    0XDECD,0XCF44,0XFDDF,0XEC56,0X98E9,0X8960,0XBBFB,0XAA72,
    0X6306,0X728F,0X4014,0X519D,0X2522,0X34AB,0X0630,0X17B9,
    0XEF4E,0XFEC7,0XCC5C,0XDDD5,0XA96A,0XB8E3,0X8A78,0X9BF1,
    0X7387,0X620E,0X5095,0X411C,0X35A3,0X242A,0X16B1,0X0738,
    0XFFCF,0XEE46,0XDCDD,0XCD54,0XB9EB,0XA862,0X9AF9,0X8B70,
    0X8408,0X9581,0XA71A,0XB693,0XC22C,0XD3A5,0XE13E,0XF0B7,
    0X0840,0X19C9,0X2B52,0X3ADB,0X4E64,0X5FED,0X6D76,0X7CFF,
    0X9489,0X8500,0XB79B,0XA612,0XD2AD,0XC324,0XF1BF,0XE036,
    0X18C1,0X0948,0X3BD3,0X2A5A,0X5EE5,0X4F6C,0X7DF7,0X6C7E,
    0XA50A,0XB483,0X8618,0X9791,0XE32E,0XF2A7,0XC03C,0XD1B5,
    0X2942,0X38CB,0X0A50,0X1BD9,0X6F66,0X7EEF,0X4C74,0X5DFD,
    0XB58B,0XA402,0X9699,0X8710,0XF3AF,0XE226,0XD0BD,0XC134,
    0X39C3,0X284A,0X1AD1,0X0B58,0X7FE7,0X6E6E,0X5CF5,0X4D7C,
    0XC60C,0XD785,0XE51E,0XF497,0X8028,0X91A1,0XA33A,0XB2B3,
    0X4A44,0X5BCD,0X6956,0X78DF,0X0C60,0X1DE9,0X2F72,0X3EFB,
    0XD68D,0XC704,0XF59F,0XE416,0X90A9,0X8120,0XB3BB,0XA232,
    0X5AC5,0X4B4C,0X79D7,0X685E,0X1CE1,0X0D68,0X3FF3,0X2E7A,
    0XE70E,0XF687,0XC41C,0XD595,0XA12A,0XB0A3,0X8238,0X93B1,
    0X6B46,0X7ACF,0X4854,0X59DD,0X2D62,0X3CEB,0X0E70,0X1FF9,
    0XF78F,0XE606,0XD49D,0XC514,0XB1AB,0XA022,0X92B9,0X8330,
    0X7BC7,0X6A4E,0X58D5,0X495C,0X3DE3,0X2C6A,0X1EF1,0X0F78,`
]


/* 

Hacer un proyecto que lea archivos de una fecha incial a una fecha final
Debera de leer los archivos
Sin son .gzip solo enviarlos normal Jos
Sin son txt comprimirlos en .gzip
Se los enviare por webservices o creo que los movere de lugar solamente

Datos de entrada
Fecha inicial
Fecha Final
IdArchivo


Datos salida
Todos los archivos que este en el rango de fecha y con el ID

*/