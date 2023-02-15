<?php

// create user
$user = array(
  'username' => md5('user'),
  'password' => md5('123'),
  'name' => 'kevin',
  'email' => 'fake@fake.de',
  'image' => 'image.png',
  'role' => 'admin'
);

$template = array(
  'hero' => json_encode(array(
    'title' => 'Content Management System',
    'subtitle' => 'Making your life easer with simple steps and big results.'
  )),
  'about' => json_encode(array(
    'title' => 'Award-Winning Software Company',
    'content' => 'We create diverse, complex, web and mobile solutions for any business need. With us you get quality software and perfect service every time.',
    'image' => 'about-img.jpg',
  )),
  'services' => json_encode(array(
    array(
      'id' => '1',
      'icon' => 'bxl-dev-to',
      'title' => 'Custom Software Development',
      'content' => 'Nisi, dis sed cursus eget pellentesque mattis. Odio eu proin aliquam a. Semper bibendum tellus non tellus, facilisi dignissim in quam massa. Aliquam, feugiat ut cum tellus, sit. Quis consectetur gravida ac ac lectus cursus egestas.'
    ),
    array(
      'id' => '2',
      'icon' => 'bx-merge',
      'title' => 'Software Integration',
      'content' => 'Nisi, dis sed cursus eget pellentesque mattis. Odio eu proin aliquam a. Semper bibendum tellus non tellus, facilisi dignissim in quam massa. Aliquam, feugiat ut cum tellus, sit. Quis consectetur gravida ac ac lectus cursus egestas.'
    ),
    array(
      'id' => '3',
      'icon' => 'bxs-mobile-vibration',
      'title' => 'Mobile App Development',
      'content' => 'Nisi, dis sed cursus eget pellentesque mattis. Odio eu proin aliquam a. Semper bibendum tellus non tellus, facilisi dignissim in quam massa. Aliquam, feugiat ut cum tellus, sit. Quis consectetur gravida ac ac lectus cursus egestas.'
    ),
    array(
      'id' => '4',
      'icon' => 'bxs-analyse',
      'title' => 'Business Analytics',
      'content' => 'Nisi, dis sed cursus eget pellentesque mattis. Odio eu proin aliquam a. Semper bibendum tellus non tellus, facilisi dignissim in quam massa. Aliquam, feugiat ut cum tellus, sit. Quis consectetur gravida ac ac lectus cursus egestas.'
    ),
  )),
  'features' => json_encode(array(
    array(
      'id' => '1',
      'icon' => 'bx-credit-card-alt',
      'title' => 'Easy Payments',
      'content' => 'Id mollis consectetur congue egestas egestas suspendisse blandit justo.'
    ),
    array(
      'id' => '2',
      'icon' => 'bxs-lock',
      'title' => 'Data Security',
      'content' => 'Augue pulvinar justo, fermentum fames aliquam accumsan vestibulum non.'
    ),
    array(
      'id' => '3',
      'icon' => 'bx-bar-chart-square',
      'title' => 'Cost Statistics',
      'content' => 'Mattis urna ultricies non amet, purus in auctor non. Odio vulputate ac nibh.'
    ),
    array(
      'id' => '4',
      'icon' => 'bx-support',
      'title' => 'Support 24/7',
      'content' => 'A elementum, imperdiet enim, pretium etiam facilisi in aenean quam mauris.'
    ),
    array(
      'id' => '5',
      'icon' => 'bx-money',
      'title' => 'Regular Cashback',
      'content' => 'Sit facilisis dolor arcu, fermentum vestibulum arcu elementum imperdiet eleifend.'
    ),
    array(
      'id' => '6',
      'icon' => 'bxs-badge-dollar',
      'title' => 'Top Standards',
      'content' => 'Faucibus cursus maecenas lorem cursus nibh. Sociis sit risus id. Sit facilisis dolor arcu.'
    ),
  )),
  'testimonials' => json_encode(array(
    array(
      'id' => '1',
      'author' => 'Ralph Edwards',
      'content' => 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Reiciendis nihil voluptates rerum nulla tempore, harum quod deleniti itaque beatae animi necessitatibus eum consectetur laudantium! Eos?'
    ),
    array(
      'id' => '2',
      'author' => 'Annette Black',
      'content' => 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Reiciendis nihil voluptates rerum nulla tempore, harum quod deleniti itaque beatae animi necessitatibus eum consectetur laudantium! Eos?'
    ),
    array(
      'id' => '3',
      'author' => 'Darrell Steward',
      'content' => 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Reiciendis nihil voluptates rerum nulla tempore, harum quod deleniti itaque beatae animi necessitatibus eum consectetur laudantium! Eos?'
    ),
  ))
);


// ob_start();
// var_dump($user_validate);
// error_log(ob_get_clean());