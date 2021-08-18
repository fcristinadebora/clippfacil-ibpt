# ClippFacil IBPT
> Microservice that fetch IBPT from De Olho No Imposto's official API and stores it into self database, so it doesn't have to fetch it again, every time

### Built with
- [NodeJs v15.9.0](https://nodejs.org/)
- [Docker](https://www.docker.com/)

## Running development server

### Install dependenciesd

```
npm install
```

### Set up .env file for application
```sh
cp .env.example .env
```

And configure your variables

### Set up database container

```
docker-compose up -d
```

### Start development server

```
npm start
```

## Usage

```json
curl --location --request GET 'http://localhost:PORT/ibpt' \
--header 'Content-Type: application/json' \
--data-raw '{
    "uf": "SP",
    "ultimaVersao": "21.0.E",
    "ncm": [
        {
            "codigo": "01051110",
            "excecaoFiscal": 0
        },
        {
            "codigo": "29038900",
            "excecaoFiscal": 0
        },
        {
            "codigo": "000002",
            "excecaoFiscal": 0
        }
    ]
}'
```

Response example:
```json
{
    "ibpt": [
        {
            "id": 1,
            "codigo": "01051110",
            "uf": "SP",
            "excecaoFiscal": 0,
            "nacional": 13.45,
            "estadual": 4.14,
            "importado": 15.45,
            "municipal": 0,
            "tipo": 0,
            "vigenciaInicio": "01/08/2021",
            "vigenciaFim": "31/08/2021",
            "chave": "115C76",
            "versao": "21.2.B",
            "fonte": "IBPT/empresometro.com.br"
        },
        {
            "id": 2,
            "codigo": "29038900",
            "uf": "SP",
            "excecaoFiscal": 0,
            "nacional": 13.45,
            "estadual": 18,
            "importado": 17.41,
            "municipal": 0,
            "tipo": 0,
            "vigenciaInicio": "01/08/2021",
            "vigenciaFim": "31/08/2021",
            "chave": "115C76",
            "versao": "21.2.B",
            "fonte": "IBPT/empresometro.com.br"
        }
    ]
}
```