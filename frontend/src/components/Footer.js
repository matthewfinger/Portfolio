import { Component } from 'react'
import { fetchList, getImage, default_base_url } from '../functions/HTTPClient'

class FooterItem extends Component {
  render() {
    return (
      <div>
        <a href={this.props.footerItem.href} target='_blank' rel='noreferrer'>
          <img src={this.props.footerItem.imageSrc} title={this.props.footerItem.name} alt={this.props.footerItem.name} />
        </a>
      </div>
    )
  }
}

class Footer extends Component {

  Content = () => {
    return (
      <div>
        { this.state.footerItems.map((footerItem, index) => (
          <FooterItem key={index} footerItem={footerItem} />
        )) }
      </div>
    );
  }

  constructor(props) {
    super(props);
    this.state = {
      footerItems: [] //from api
    }
  }

  async componentDidMount() {
    const footerItemsNoSrc = await fetchList(default_base_url + '/post/footer_items/');
    let footerItems = [];
    let imageSrc = '';
    let imageObject = {};
    for (let i = 0; i < footerItemsNoSrc.length; i++) {
      imageObject = await getImage(footerItemsNoSrc[i].image, false);
      imageSrc = imageObject.image ? default_base_url + imageObject.image : '';
      footerItems.push({ ...footerItemsNoSrc[i], imageSrc });
    }

    this.setState({ footerItems });
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
