import weaviate from 'weaviate-ts-client';
import fs from 'fs';
const client = weaviate.client({
    scheme: 'http',
    host: 'localhost:8080',
});
const schemaConfig = {
    'class': 'Meme',
    'vectorizer': 'img2vec-neural',
    'vectorIndexType': 'hnsw',
    'moduleConfig': {
        'img2vec-neural': {
            'imageFields': [
                'image'
            ]
        }
    },
    'properties': [
        {
            'name': 'image',
            'dataType': ['blob']
        },
        {
            'name': 'text',
            'dataType': ['string']
        }
    ]
}

//const schemaRes = await client.schema.getter().do();
//console.log(schemaRes)
const img = fs.readFileSync('./img/hi-mom.jpg');
const b64 = Buffer.from(img).toString('base64');
await client.data.creator()
  .withClassName('Meme')
  .withProperties({
    image: b64,
    text: 'matrix meme'
  })
  .do();
  const test = Buffer.from(fs.readFileSync('./test.jpg') ).toString('base64');
  const resImage = await client.graphql.get()
    .withClassName('Meme')
    .withFields(['image'])
    .withNearImage({ image: test })
    .withLimit(1)
    .do();
  
  // Write result to filesystem
  const result = resImage.data.Get.Meme[0].image;
  fs.writeFileSync('./result.jpg', result, 'base64');