<?php
  $dataFromPage = file_get_contents('https://www.eliftech.com/school-task');
  // TODO: add check 200 status and if error - "https://u0byf5fk31.execute-api.eu-west-1.amazonaws.com/etschool/task"
  echo $dataFromPage;
?>