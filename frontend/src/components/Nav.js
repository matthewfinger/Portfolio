import BaseComponent from './BaseComponent'

class Nav extends BaseComponent {
  Content = () => {
    const {content} = this.state.post;
    try {
      const sectgroups = content.split(';');
      let sections = [];
      sectgroups.forEach(sectionstr => {
        let splitstr = sectionstr.split(',');
        sections.push({sectionName:splitstr[0], sectionId:splitstr[1]})
      });
      return (
        <ul className='navUl'>
          <li id="navLogo">
            <a href="#" id="navLogoLink"><img src="/logo.png"/></a>
          </li>
          {sections.map((section, index) =>
            <li key={index}>
              <a href={`#${section.sectionId}`}>{section.sectionName}</a>
            </li>
          )}
        </ul>
      );
    } catch (error) {
      console.warn(error);
      return (<></>);
    }
  }

  render() {
    return (
      <nav id="pageNav">
        <this.Content />
      </nav>
    )
  }
}

export default Nav
