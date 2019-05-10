import { globalStore } from "../../../GlobalStore/GlobalStore";

const withStoreListener = (WrappedComponent, storeKey) => {
  return class extends WrappedComponent {
    constructor(props) {
      super(props);

      this.onStoreUpdate = super.onStoreUpdate.bind(this);
      this.removeStoreListener = globalStore.onDidChange(
        storeKey,
        this.onStoreUpdate
      );
    }

    componentWillUnmount() {
      this.removeStoreListener();
    }

    render() {
      return super.render();
    }
  };
};

export default withStoreListener;
