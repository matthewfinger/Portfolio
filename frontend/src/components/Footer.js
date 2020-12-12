import BaseComponent from './BaseComponent'

class Footer extends BaseComponent {
  Content = () => {
    const emailIconSrc = this.props.emailIconSrc || '/email_icon.png';
    const phoneIconSrc = this.props.phoneIconSrc || '/phone_icon.png';
    const linkedinIconSrc = this.props.linkedinIconSrc || '/LI-In-Bug.png';
    const emailUrl = this.props.emailUrl || 'mailto:matthewfinger3@gmail.com';
    const phoneUrl = this.props.phoneUrl || 'tel:2623081988';
    const linkedinUrl = this.props.linkedinUrl || 'https://www.linkedin.com/in/matthew-finger-1b5766164?lipi=urn%3Ali%3Apage%3Ad_flagship3_profile_view_base_contact_details%3BZmuEzprVTL25ZLP8TKxNyg%3D%3D';
    return (
      <div>
        <div><a href={emailUrl} target='_blank' rel='noreferrer'><img src={emailIconSrc} alt="email"/></a></div>
        <div><a href={phoneUrl} target='_blank' rel='noreferrer'><img src={phoneIconSrc} alt="call me"/></a></div>
        <div><a href={linkedinUrl} target='_blank' rel='noreferrer'><img src={linkedinIconSrc} alt="email"/></a></div>
      </div>
    );
  }

  render() {
    return (
      <footer id="pageFooter">
        <this.Content />
      </footer>
    );
  }
}

export default Footer
