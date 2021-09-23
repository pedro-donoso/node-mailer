const mySend = require('./mails');
const http = require('http');
const url = require('url');
const fs = require('fs');
const axios = require('axios');
const {
    v4: uuidv4
} = require('uuid');

http
    .createServer((req, res) => {

        let {
            myEmail,
            myMessage,
            content
        } = url.parse(req.url, true).query;

        if (req.url == '/') {
            res.setHeader('content-type', 'text/html');
            fs.readFile('index.html', 'utf8', (err, data) => {
                res.end(data);
            })
        }

        if (req.url.startsWith('/sending')) {

            let valorUF;
            let valorDolar;
            let dolarIntercambio;
            let valorEuro;
            let valorUTM;
            let libraCobre;

            async function getData() {

                let {
                    data
                } = await axios.get('https://mindicador.cl/api');

                valorUF = data.uf.valor;
                valorDolar = data.dolar.valor;
                dolarIntercambio = data.dolar_intercambio.valor;
                valorEuro = data.euro.valor;
                valorUTM = data.utm.valor;
                libraCobre = data.libra_cobre.valor;
                tasaDesempleo = data.tasa_desempleo.valor;
                bitcoin = data.bitcoin.valor;
            }

            getData()
                .then(() => {

                    content += `  
                    
                    \n Unidad de Fomento (UF): ${valorUF}
                    \n Dólar: ${valorDolar}
                    \n Dólar intercambio: ${dolarIntercambio}
                    \n Euro: ${valorEuro}
                    \n Unidad Tributaria Mensual (UTM): ${valorUTM}
                    \n Libra de Cobre: ${libraCobre}
                    \n Tasa de Desempleo: ${tasaDesempleo}
                    \n Bitcoin: ${bitcoin}
                    `;

                    return myEmail, myMessage, content;
                })
                .then(() => {

                    if ((myEmail !== '') && (myMessage !== '') && (content !== '') && (myEmail.includes(','))) {
                        mySend(myEmail.split(','), myMessage, content);
                        console.log(`Tu mensaje fue correctamente enviado a los siguientes usuarios: ${myEmail}`);
                        res.write('Tus correos ya fueron enviados satisfactoriamente');
                        res.end();

                        let id = uuidv4();

                        fs.writeFile(`enviados/email_id_${id}`, `Correos electrónicos:${myEmail}\n\nMensaje: ${myMessage}\n\nContenido:\n${content}`, 'utf8', () => {
                            console.log(`El Mensaje para el email_id_${id} ya fue creado!`);
                        })
                    } else {
                        res.write('Ups, te falta completar algunos datos, recuerda escribir mas de 1 direccion de correo');
                        res.end();
                    }
                });

        }
    })
    .listen(3003, () => {
        console.log('Actualmente estoy escuchando en el puerto 3003')
    })

    //finaliza