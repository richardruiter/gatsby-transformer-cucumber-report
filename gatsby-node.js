exports.createSchemaCustomization = ({ actions }) => {
  const { createTypes } = actions;
  const typeDefs = `
    type CucumberReport implements Node  {
      features: [CucumberReportFeature]
    }

    type CucumberReportFeature {
      keyword: String
      description: String
      line: Int
      name: String
      uri: String
      id: String
      metadata: CucumberReportMetadata
      elements: [CucumberReportElements]
      tags: [CucumberReportTags]
    }

    type CucumberReportPlatform {
      name: String
      version: String
    }

    type CucumberReportBrowser {
      name: String
      version: String
    }

    type CucumberReportMetadata {
      device: String
      platform: CucumberReportPlatform
      browser: CucumberReportBrowser
    }

    type CucumberReportMatch {
      location: String
    }

    type CucumberReportResult {
      status: String
      duration: Int
    }

    type CucumberReportSteps {
      keyword: String
      name: String
      line: String
      match: CucumberReportMatch
      result: CucumberReportResult
      arguments: [String]
      embeddings: [CucumberReportEmbedding]
    }

    type CucumberReportLocation {
      line: Int
      column: Int
    }

    type CucumberReportElements {
      keyword: String
      description: String
      name: String
      id: String
      steps: [CucumberReportSteps]
      tags: [CucumberReportTags]
    }

    type CucumberReportTags {
      type: String
      name: String
      location: CucumberReportLocation
    }

    type CucumberReportEmbedding {
      data: String
      mime_type: String
    }
  `;
  createTypes(typeDefs);
};

exports.onCreateNode = async ({
  node,
  loadNodeContent,
  createNodeId,
  createContentDigest,
  actions
}) => {
  // only look for nodes of mediaType `application/json`
  if (node.internal.mediaType !== `application/json`) {
    return;
  }
  const content = await loadNodeContent(node);
  const report = {};
  report.features = JSON.parse(content).filter(
    item => item.keyword && item.keyword === "Feature"
  );
  if (report.features.length > 0) {
    const { createNode, createParentChildLink } = actions;
    const reportId = createNodeId(`${node.id} >>> CUCUMBER REPORT`);
    const reportNode = {
      ...report,
      id: reportId,
      children: [],
      parent: node.id,
      internal: {
        contentDigest: createContentDigest(report),
        type: "CucumberReport"
      }
    };
    createNode(reportNode);
    createParentChildLink({ parent: node, child: reportNode });
  }
};
