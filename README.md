# Software Engineer Portfolio

A clean, professional portfolio website built with HTML and CSS. Designed to showcase software engineering skills, projects, and experience in a simple yet effective manner.

## Features

- **Responsive Design**: Works on all devices from mobile to desktop
- **Clean, Professional Layout**: Focus on content and readability
- **Accessibility-First**: Semantic HTML and ARIA labels
- **No Dependencies**: Pure HTML/CSS with minimal JavaScript
- **Easy to Customize**: Well-structured code with CSS variables

## Project Structure
```
portfolio/
├── index.html # Main HTML file
└── css # Stylesheet folder
    └── style.css # Main stylesheet
├── README.md # Documentation
└── assets/ # Resources directory
    └── profile.png/ # Profile image
```

## Customization Guide

### 1. Personal Information
Edit the following in `index.html`:
- Name, title, and description in the hero section
- About me text
- Education, experience, and location details
- Contact information (email, phone, location)

### 2. Skills
Update the skills section with your technical expertise:
- Frontend technologies
- Backend technologies
- DevOps and tools

### 3. Projects
Replace the placeholder projects with your actual work:
- Project titles and descriptions
- Technologies used
- Links to live demos or repositories

### 4. Experience
Update the timeline with your professional experience:
- Job titles and companies
- Dates of employment
- Key responsibilities and achievements

### 5. Styling
Customize the appearance by modifying CSS variables in `style.css`:
```css
:root {
    --color-primary: #2563eb;     /* Primary brand color */
    --color-secondary: #64748b;   /* Secondary color */
    /* ... other variables */
}
```
### 6. Images

1. Add your profile photo:

    - Save as assets/images/profile.jpg

    - Replace the placeholder in the hero section

    - Ensure the image is square and properly sized

1. Add project screenshots (if desired):

    - Update project cards with appropriate images

#### Best Practices Implemented
**HTML** 

- Semantic HTML5 elements

- Proper heading hierarchy (h1 → h6)

- Accessibility attributes (aria-label, alt text)

- Meta tags for SEO and social sharing

- Form validation attributes

**CSS**

- CSS variables for consistent theming

- Mobile-first responsive design

- BEM methodology for class naming

- Flexbox and Grid for layouts

- CSS reset for cross-browser consistency

**Performance**

- Minimal assets and dependencies

- Efficient CSS selectors

- Font optimization with font-display

- Lazy loading ready (for future images)

**Accessibility**

- Sufficient color contrast

- Focus states for interactive elements

- Screen reader friendly markup

- Keyboard navigation support

**Adding Animations (Future Enhancement)**

When ready to add animations, I'll consider:

- Subtle transitions on hover states

- Scroll-triggered animations for sections

- Page load animations for hero content

- CSS animations for interactive elements

### 👨‍💻 Author

**Amine El Haouat**

**LinkedIn**: https://www.linkedin.com/in/amine-el-haouat/

**GitHub**: @PhantomVisible
