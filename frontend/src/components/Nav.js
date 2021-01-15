import { BaseComponent } from './BaseComponent'

class Nav extends BaseComponent {
  constructor(props) {
    super(props);
    this.state.evaluateDynamicContent = false;
  }

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
        <ul className='navUl' id='navUl' data-toggler="#navToggle">
          <li id="navLogo">
            <a href="#root" id="navLogoLink"><img alt="" src="/logo.png"/><span className="mobileOnly">Top of Page</span></a>
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
        <div id="navToggle"><span>•••</span></div>
        <this.Content />
      </nav>
    )
  }
}

export default Nav
