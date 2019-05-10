import { globalStore } from "../../../GlobalStore/GlobalStore";

const withStoreListener = (WrappedComponent, storeKey, stateKey) => {
  return class extends WrappedComponent {
    constructor(props) {
      super(props);

      this.onStoreUpdate = this.onStoreUpdate.bind(this);
      this.removeStoreListener = globalStore.onDidChange(
        storeKey,
        this.onStoreUpdate
      );
    }

    componentWillUnmount() {
      this.removeStoreListener();
    }

    onStoreUpdate(updatedData) {
      this.setState({
        [stateKey]: updatedData
      });
    }

    render() {
      return super.render();
    }
  };
};

export default withStoreListener;
