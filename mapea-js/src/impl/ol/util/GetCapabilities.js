import OLFormatWMTSCapabilities from 'ol/format/WMTSCapabilities';
import { get as getRemote } from 'M/util/Remote';

const getImplWMTSCapabilities = (url) => {
  return new Promise((success, fail) => {
    const parser = new OLFormatWMTSCapabilities();
    getRemote(url).then((response) => {
      const getCapabilitiesDocument = response.xml;
      const parsedCapabilities = parser.read(getCapabilitiesDocument);
      success.call(this, parsedCapabilities);
    });
  });
};

export default getImplWMTSCapabilities;
