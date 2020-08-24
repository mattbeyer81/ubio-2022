echo 'Create: '
curl -XPOST -H "Content-type: application/json" -d '{"foo": 1}' 'http://localhost:3000/particle-detector/e335175a-eace-4a74-b99c-c6466b6afadd' -w "\n"

echo 'Delete'
curl -XDELETE 'http://localhost:3000/particle-detector/e335175a-eace-4a74-b99c-c6466b6afadd' -w "\n"

echo 'Create and get summary:'
curl -XPOST 'http://localhost:3000/particle-detector/e335175a-eace-4a74-b99c-c6466b6afadd' -w "\n"
curl -XPOST 'http://localhost:3000/particle-detector/e335175a-eace-4a74-b99c-c6466b6afade' -w "\n"
curl -XPOST 'http://localhost:3000/not-particle-detector/e335175a-eace-4a74-b99c-c6466b6afadd' -w "\n"
curl -XPOST 'http://localhost:3000/not-particle-detector/e335175a-eace-4a74-b99c-c6466b6afade' -w "\n"
curl -XPOST 'http://localhost:3000/not-particle-detector/e335175a-eace-4a74-b99c-c6466b6afadf' -w "\n"
curl -XGET 'http://localhost:3000' -w "\n"

echo 'Get by group:'
curl -XGET 'http://localhost:3000/particle-detector' -w "\n"
