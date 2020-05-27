export function buildTree(treeNodes) {
  var itemMap = new Array();
  for (let treeNode of treeNodes) {
    itemMap[treeNode.id] = treeNode;
  }

  var parentMap = new Array();
  var trees = new Array();
  for (let treeNode of treeNodes) {
    var parent = itemMap[treeNode.parentId];
    var hadBuild = parentMap[treeNode.parentId];
    if(!parent && !hadBuild){
      var subTree = buildRecursive(treeNodes, treeNode.parentId);
      var trees = trees.concat(subTree);
      parentMap[treeNode.parentId] = true;
    }
  }

  trees = trees.sort(function(a, b) {
    return a.order - b.order;
  });

  return trees;
}

export function bulidTwoLevel(treeNodes, root) {
  var trees = new Array();

  for (let treeNode of treeNodes) {
    if (root == treeNode.parentId) {
      trees.push(treeNode);
    }

    for (let it of treeNodes) {
      if (treeNode.id == it.parentId) {
        if(!trees.children){
          trees.children = new Array();
        }
        treeNode.push(it);
      }
    }
  }
  return trees;
}

export function buildRecursive(treeNodes, root) {
  var trees = new Array();
  for (let treeNode of treeNodes) {
    if (root == treeNode.parentId) {
      trees.push(findChildren(treeNode, treeNodes));
    }
  }

  trees = trees.sort(function(a, b) {
    return a.order - b.order;
  });

  return trees;
}

export function findChildren(treeNode, treeNodes) {
  for (let it of treeNodes) {
    if (treeNode.id == it.parentId) {
      if (!treeNode.children) {
        treeNode.children = new Array();
      }
      treeNode.children.push(findChildren(it, treeNodes));
    }
  }

  for (let it of treeNodes) {
    if (!!it.children) {
      let cd = it.children.sort(function(a, b) {
        return a.order - b.order;
      });

      it.children = cd;
    }
  }

  return treeNode;
}
