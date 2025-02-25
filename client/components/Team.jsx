import React from 'react';
import { FaFacebook,FaGithub,FaLinkedin,FaTwitter } from 'react-icons/fa';

const TeamMember = ({ image, title, name, socialLinks }) => {
  return (
    <div className="max-w-sm bg-white rounded-lg shadow-lg overflow-hidden mt-20">
        
      <img
        className="w-full h-66 object-cover"
        src={image}
        alt={name}
      />
      <div className="p-6">
        <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
        <h3 className="text-lg font-medium text-gray-600 mt-2">{name}</h3>
        <div className="mt-4 flex space-x-4">
          {socialLinks.map((link, index) => (
            <a key={index} href={link.url} target="_blank" rel="noopener noreferrer" 
            className="text-gray-500 hover:text-gray-700">
              {link.icon}
            </a>
          ))}
        </div>
          <p></p>
      </div>
    </div>
  );
};

const Team = () => {
  const teamMembers = [
    {
      image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTMZzZcw0K_YiPYmtAARhLWMj1SJERN5M2hsQ&s',
      title: 'Developer',
      name: 'Abdul Muhmin Soliu',

      socialLinks: [
        { icon: <i className="fab fa-facebook-f"><FaFacebook/></i>, url: 'https://facebook.com' },
        { icon: <i className="fab fa-twitter"><FaTwitter/></i>, url: 'https://twitter.com' },
        { icon: <i className="fab fa-linkedin-in"><FaLinkedin/></i>, url: 'https://linkedin.com' }
      ]
    },
    {
      image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSdqfWgBeWeh1Vd808t4lCrJ_kXs5c_Hpo6Fg&s',
      title: 'Developer',
      name: 'Abdul Muhmin Sodiq',
      socialLinks: [
        { icon: <i className="fab fa-facebook"><FaFacebook/></i>, url: 'https://facebook.com' },
        { icon: <i className="fab fa-github"><FaGithub/></i>, url: 'https://github.com' },
        { icon: <i className="fab fa-twitter"><FaTwitter/></i>, url: 'https://twitter.com' }
      ]
    },

    {
      image: 'https://t3.ftcdn.net/jpg/01/80/80/28/360_F_180802852_C3Zm4g9avBz5osPEA769dF0KKp5cQZYT.jpg',
      title: 'Figma',
      name: 'Oluwaseyi',
      socialLinks: [
        { icon: <i className="fab fa-facebook"><FaFacebook/></i>, url: 'https://facebook.com' },
        { icon: <i className="fab fa-github"><FaGithub/></i>, url: 'https://github.com' },
        { icon: <i className="fab fa-twitter"><FaTwitter/></i>, url: 'https://twitter.com' }
      ]
    }
    
  ];

  return (
    <div>
        <h1 className='text-gray-600 text-4xl mt-10  text-bold  text-center'> Meet Our Team</h1>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
        
      {teamMembers.map((member, index) => (
          <TeamMember key={index} {...member} />
        ))}
      
    </div>
    <div className="max-w-[800px] mx-auto p-6">
      <p className="text-lg text-gray-700 leading-relaxed">
        Our team is a passionate group of professionals committed 
        to delivering high-quality solutions. We believe in innovation,
         collaboration, and continuous improvement to provide the best
          experience for our clients. Each member brings unique
           expertise and dedication to the table, making us a diverse
            and dynamic team ready to take on new challenges.
      </p>
    </div>
        </div>
  );
};

export default Team;
