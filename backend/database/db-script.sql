create database `cms`;

use `cms`;

CREATE TABLE `users` (
  `id` int not null auto_increment,
  `username` varchar(50) NOT NULL,
  `password` varchar(50) NOT NULL,
  `name` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `image` varchar(100) not null default 'user.png',
  `status` tinyint NOT NULL DEFAULT 1,
  constraint pk_username primary key (id)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4;

INSERT INTO
  `users` (
    `username`,
    `password`,
    `name`,
    `email`,
    `image`,
    `status`
  )
VALUES
  (
    'ee11cbb19052e40b07aac0ca060c23ee',
    'c4ca4238a0b923820dcc509a6f75849b',
    'kevin',
    'email@email.com',
    default,
    default
  );

INSERT INTO
  `useruserss` (
    `username`,
    `password`,
    `name`,
    `email`,
    `image`,
    `status`
  )
VALUES
  (
    '7e58d63b60197ceb55a1c487989a3720',
    'c4ca4238a0b923820dcc509a6f75849b',
    'pedro',
    'email@email.com',
    default,
    default
  );

create table `templates` (
  `id` int not null auto_increment,
  `hero` json not null,
  `about` json not null,
  `services` json not null,
  `features` json not null,
  `testimonials` json not null,
  `status` tinyint NOT NULL DEFAULT 0,
  constraint pk_id primary key (id)
) engine = InnoDB default charset = utf8mb4;

INSERT INTO
  `templates`(
    `id`,
    `hero`,
    `about`,
    `services`,
    `features`,
    `testimonials`,
    `status`
  )
VALUES
  (
    default,
    '{\"title\": \"Content Management  System\", \"subtitle\": \"Making your life easer with simple steps and big results.\"}',
    '{\"image\": \"collection01.jpg\", \"title\": \"Award-Winning Software Company\", \"content\": \"We create diverse, complex, web and mobile solutions for any business need. With us you get quality software and perfect service every time.\", \"subtitle\": \"We create diverse, complex, web and mobile solutions for any business need. With us you get quality software and perfect service every time.\"}',
    '[{\"id\": \"1\", \"icon\": \"bx bx bx-trending-up\", \"title\": \"Custom Software  Development\", \"content\": \"Nisi, dis sed cursus eget pellentesque mattis. Odio eu proin aliquam a. Semper bibendum tellus non tellus, facilisi dignissim in quam massa. Aliquam, feugiat ut cum tellus, sit. Quis consectetur gravida ac ac lectus cursus egestas.\"}, {\"id\": \"2\", \"icon\": \"bx-merge\", \"title\": \"Software Integration\", \"content\": \"Nisi, dis sed cursus eget pellentesque mattis. Odio eu proin aliquam a. Semper bibendum tellus non tellus, facilisi dignissim in quam massa. Aliquam, feugiat ut cum tellus, sit. Quis consectetur gravida ac ac lectus cursus egestas.\"}, {\"id\": \"3\", \"icon\": \"bxs-mobile-vibration\", \"title\": \"Mobile App Development\", \"content\": \"Nisi, dis sed cursus eget pellentesque mattis. Odio eu proin aliquam a. Semper bibendum tellus non tellus, facilisi dignissim in quam massa. Aliquam, feugiat ut cum tellus, sit. Quis consectetur gravida ac ac lectus cursus egestas.\"}, {\"id\": \"4\", \"icon\": \"bxs-analyse\", \"title\": \"Business Analytics\", \"content\": \"Nisi, dis sed cursus eget pellentesque mattis. Odio eu proin aliquam a. Semper bibendum tellus non tellus, facilisi dignissim in quam massa. Aliquam, feugiat ut cum tellus, sit. Quis consectetur gravida ac ac lectus cursus egestas.\"}]',
    '[{\"id\": \"1\", \"icon\": \"bx bx bx-credit-card-alt\", \"title\": \"Easy Payments\", \"content\": \"Id mollis consectetur congue egestas egestas suspendisse blandit justo.\"}, {\"id\": \"2\", \"icon\": \"bxs-lock\", \"title\": \"Data Security\", \"content\": \"Augue pulvinar justo, fermentum fames aliquam accumsan vestibulum non.\"}, {\"id\": \"3\", \"icon\": \"bx-bar-chart-square\", \"title\": \"Cost Statistics\", \"content\": \"Mattis urna ultricies non amet, purus in auctor non. Odio vulputate ac nibh.\"}, {\"id\": \"4\", \"icon\": \"bx-support\", \"title\": \"Support 24/7\", \"content\": \"A elementum, imperdiet enim, pretium etiam facilisi in aenean quam mauris.\"}, {\"id\": \"5\", \"icon\": \"bx-money\", \"title\": \"Regular Cashback\", \"content\": \"Sit facilisis dolor arcu, fermentum vestibulum arcu elementum imperdiet eleifend.\"}, {\"id\": \"6\", \"icon\": \"bxs-badge-dollar\", \"title\": \"Top Standards\", \"content\": \"Faucibus cursus maecenas lorem cursus nibh. Sociis sit risus id. Sit facilisis dolor arcu.\"}]',
    '[{\"id\": \"1\", \"author\": \"Ralph  Edwards\", \"content\": \"Lorem ipsum dolor sit amet, consectetur adipisicing elit. Reiciendis nihil voluptates rerum nulla tempore, harum quod deleniti itaque beatae animi necessitatibus eum consectetur laudantium! Eos?\"}, {\"id\": \"2\", \"author\": \"Annette Black\", \"content\": \"Lorem ipsum dolor sit amet, consectetur adipisicing elit. Reiciendis nihil voluptates rerum nulla tempore, harum quod deleniti itaque beatae animi necessitatibus eum consectetur laudantium! Eos?\"}, {\"id\": \"3\", \"author\": \"Darrell Steward\", \"content\": \"Lorem ipsum dolor sit amet, consectetur adipisicing elit. Reiciendis nihil voluptates rerum nulla tempore, harum quod deleniti itaque beatae animi necessitatibus eum consectetur laudantium! Eos?\"}]',
    1
  )