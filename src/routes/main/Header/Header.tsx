import React from "react";

import { Menu, Tabs, Group, Modal, Stack, Button, Collapse, TextInput, ActionIcon, ScrollArea } from "@mantine/core";
import { useForm } from "@mantine/form";

import { IconX, IconEdit, IconPlus, IconSearch } from "@tabler/icons-react";

import { DyIcon } from "~/components/DyIcon";
import { useSearch } from "~/features/search";
import { Tag, useTags, DEFAULT_TAG, DEFAULT_TAG_ICON } from "~/features/tags";

export const Header = React.memo(() => {
  const scrollAreaRef = React.useRef<HTMLDivElement>(null);
  const searchRef = React.useRef<HTMLInputElement>(null);

  const tags = useTags();
  const search = useSearch();

  const [showSearch, setShowSearch] = React.useState(false);

  const [manageTag, setManageTag] = React.useState<Tag | null>(null);
  const [deleteTag, setDeleteTag] = React.useState<Tag | null>(null);

  const [tagModal, setTagModal] = React.useState<{
    open: boolean;
    mode: "add" | "edit";
    data: Tag | null;
  }>({
    open: false,
    mode: "add",
    data: null,
  });

  //

  const tagForm = useForm({
    mode: "uncontrolled",
    initialValues: {
      label: "",
      icon: DEFAULT_TAG_ICON,
    },
    validate: {
      label: (label) => {
        if (label.length < 1) {
          return "Label is too short";
        }
      },
    },
  });

  //

  React.useEffect(() => {
    if (tagModal.mode === "edit" && tagModal.data) {
      return tagForm.setValues({
        label: tagModal.data.label,
        icon: tagModal.data.icon,
      });
    }

    tagForm.reset();
  }, [tagModal]);

  //

  const focusActiveTag = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    const scrollArea = scrollAreaRef.current;
    const tabElement = event.currentTarget;

    if (!scrollArea) return;

    const scrollLeft = tabElement.offsetLeft - (scrollArea.offsetWidth / 2) + (tabElement.offsetWidth / 2);

    scrollArea.scrollTo({
      left: scrollLeft,
      behavior: "smooth",
    });
  };

  //

  const switchTag = (tagId: string | null) => {
    tags.setActiveTag(tagId || DEFAULT_TAG.id);
  };

  //

  const toggleSearch = () => {
    search.setQuery("");
    setShowSearch((prev) => !prev);
  };

  //

  const handleTagContextMenu = (event: React.MouseEvent, tag: Tag) => {
    event.preventDefault();
    setManageTag(tag);
  };

  //

  const handleTagSubmit = React.useCallback((values: typeof tagForm.values) => {
    if (tagModal.mode === "add") {
      tags.addTag({
        label: values.label,
        icon: values.icon,
      });
    } else if (tagModal.data) {
      tags.updateTag(tagModal.data.id, {
        label: values.label,
        icon: values.icon,
      });
    }

    setTagModal((s) => ({
      ...s,
      open: false,
      data: null,
    }));

    tagForm.reset();
  }, [tagForm, tagModal]);

  const handleOpenModal = React.useCallback((mode: "add" | "edit", tag?: Tag) => {
    setTagModal({
      mode,
      open: true,
      data: tag || null,
    });
  }, []);

  //

  const handleTagDelete = () => {
    setDeleteTag(null);
    if (!deleteTag) return;
    tags.removeTag(deleteTag.id);
  };

  return (
    <Stack gap={"xs"}>
      <Tabs value={tags.activeTag} variant={"pills"} onChange={switchTag}>
        <Group gap={"xs"}>
          <ActionIcon variant={showSearch ? "filled" : "default"} onClick={toggleSearch}>
            <IconSearch size={18}/>
          </ActionIcon>
          <ScrollArea viewportRef={scrollAreaRef} flex={1} scrollbars={"x"} type={"never"}>
            <Tabs.List styles={{ list: { flexWrap: "nowrap" } }}>
              <Tabs.Tab p={"xs"} pr={"md"} value={DEFAULT_TAG.id} leftSection={<DyIcon icon={DEFAULT_TAG.icon} size={18}/>} onClick={focusActiveTag}>
                { DEFAULT_TAG.label }
              </Tabs.Tab>
              {
                tags.items.map((tag) => (
                  <Menu
                    key={tag.id}
                    width={120}
                    opened={manageTag?.id === tag.id} position={"bottom"}
                    shadow={"md"}
                    onClose={() => setManageTag(null)}
                  >
                    <Menu.Target>
                      <Tabs.Tab
                        key={tag.id}
                        p={"xs"}
                        value={tag.id}
                        leftSection={(
                          <DyIcon icon={tag.icon} size={18}/>
                        )}
                        onClick={focusActiveTag}
                        onContextMenu={(event) => {
                          if (tag.editable) handleTagContextMenu(event, tag);
                        }}
                      >
                        { tag.label }
                      </Tabs.Tab>
                    </Menu.Target>
                    <Menu.Dropdown>
                      <Menu.Item
                        rightSection={<IconEdit size={14}/>}
                        onClick={() => handleOpenModal("edit", tag)}
                      >
                        Edit
                      </Menu.Item>
                      <Menu.Item
                        rightSection={<IconX size={14}/>}
                        onClick={() => {
                          setDeleteTag(tag);
                        }}
                      >
                        Delete
                      </Menu.Item>
                    </Menu.Dropdown>
                  </Menu>
                ))
              }
            </Tabs.List>
          </ScrollArea>
          <ActionIcon variant={"default"} onClick={() => handleOpenModal("add")}>
            <IconPlus size={18}/>
          </ActionIcon>
          <Modal
            opened={tagModal.open}
            title={tagModal.mode === "add" ? "Add tag" : "Edit tag"}
            onClose={() => setTagModal((s) => ({ ...s, open: false, data: null }))}
          >
            <form onSubmit={tagForm.onSubmit(handleTagSubmit)}>
              <Stack>
                <TextInput
                  {...tagForm.getInputProps("label")}
                  key={tagForm.key("label")}
                  variant={"default"}
                  placeholder={"Label"}
                  rightSection={(
                    <ActionIcon variant={"default"}>
                      <DyIcon
                        icon={tagForm.getValues().icon}
                        size={18}
                      />
                    </ActionIcon>
                  )}
                  data-autofocus
                />
                <Button type={"submit"}>{ tagModal.mode === "add" ? "Add" : "Save" }</Button>
              </Stack>
            </form>
          </Modal>
          <Modal title={"Delete tag"} opened={Boolean(deleteTag)} onClose={() => setDeleteTag(null)}>
            <Stack>
              <Button color={"red"} autoFocus onClick={handleTagDelete}>
                Delete
              </Button>
            </Stack>
          </Modal>
        </Group>
      </Tabs>
      <Collapse in={showSearch} onTransitionEnd={() => searchRef.current?.focus()}>
        <TextInput
          ref={searchRef}
          variant={"default"}
          placeholder={"Search"}
          value={search.query}
          onChange={(event) => search.setQuery(event.currentTarget.value)}
        />
      </Collapse>
    </Stack>
  );
});
